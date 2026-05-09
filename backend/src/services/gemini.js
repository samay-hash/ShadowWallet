import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Well-known Solana program IDs
const KNOWN_PROGRAMS = {
  '11111111111111111111111111111111': { name: 'System Program', risk: 'low' },
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': { name: 'SPL Token Program', risk: 'low' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRS': { name: 'Associated Token Account', risk: 'low' },
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': { name: 'Metaplex Metadata', risk: 'low' },
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ': { name: 'Candy Machine', risk: 'medium' },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter Aggregator', risk: 'low' },
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': { name: 'Raydium AMM', risk: 'low' },
};

const DANGEROUS_PATTERNS = [
  'setAuthority', 'drainWallet', 'closeAccount', 'transfer all',
  'unlimited approval', 'delegateStake', 'deactivate',
];

/**
 * Parse a base64 transaction and extract readable instruction data
 */
export async function parseTransaction(transactionBase64) {
  try {
    // Dynamic import to avoid ESM issues
    const { Transaction, VersionedTransaction } = await import('@solana/web3.js');
    
    const buffer = Buffer.from(transactionBase64, 'base64');
    let parsed;
    try {
      parsed = VersionedTransaction.deserialize(buffer);
    } catch {
      parsed = Transaction.from(buffer);
    }

    const instructions = [];
    const txInstructions = parsed.message?.compiledInstructions || parsed.instructions || [];
    const accountKeys = parsed.message?.staticAccountKeys || parsed.message?.accountKeys || [];

    for (const ix of txInstructions) {
      const programId = accountKeys[ix.programIdIndex]?.toBase58?.() ||
                        (ix.programId?.toBase58 ? ix.programId.toBase58() : ix.programId?.toString());
      const knownProgram = KNOWN_PROGRAMS[programId];
      
      instructions.push({
        programId,
        programName: knownProgram?.name || 'Unknown Program',
        isKnownProgram: !!knownProgram,
        risk: knownProgram?.risk || 'unknown',
        accountsInvolved: ix.accountKeyIndexes?.length || ix.keys?.length || 0,
        dataLength: ix.data?.length || 0,
      });
    }

    return {
      instructionCount: instructions.length,
      instructions,
      signerCount: parsed.message?.header?.numRequiredSignatures || 1,
      hasUnknownPrograms: instructions.some(i => !i.isKnownProgram),
    };
  } catch (err) {
    console.error('[parseTransaction] Error:', err.message);
    return { error: 'Could not parse transaction', instructionCount: 0, instructions: [] };
  }
}

/**
 * Analyze transaction with Gemini AI
 */
export async function analyzeWithGemini({ parsedTx, siteUrl, rawBase64 }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a Solana blockchain security expert. Analyze this transaction and return ONLY valid JSON.

Website: ${siteUrl}
Transaction has ${parsedTx.instructionCount} instruction(s):

${parsedTx.instructions.map((ix, i) => `
Instruction ${i + 1}:
- Program: ${ix.programName} (${ix.programId})
- Known Program: ${ix.isKnownProgram ? 'YES' : 'NO - SUSPICIOUS'}
- Risk Level: ${ix.risk}
- Accounts Involved: ${ix.accountsInvolved}
`).join('')}

Unknown programs present: ${parsedTx.hasUnknownPrograms ? 'YES' : 'NO'}

Return this exact JSON structure:
{
  "riskScore": <number 0-100, where 100 is maximum danger>,
  "verdict": "<SAFE | WARNING | DANGER>",
  "summary": "<one sentence explaining what this transaction does>",
  "warnings": ["<warning 1>", "<warning 2>"],
  "recommendation": "<what user should do>",
  "details": {
    "solChanges": "<estimated SOL change if detectable>",
    "tokenChanges": "<token changes if any>",
    "suspiciousElements": ["<element 1>"]

  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    return JSON.parse(jsonStr.trim());
  } catch (err) {
    console.error('[Gemini] Error:', err.message);
    // Fallback heuristic analysis
    return fallbackAnalysis(parsedTx);
  }
}

function fallbackAnalysis(parsedTx) {
  const hasUnknown = parsedTx.hasUnknownPrograms;
  const riskScore = hasUnknown ? 75 : 25;
  return {
    riskScore,
    verdict: hasUnknown ? 'WARNING' : 'SAFE',
    summary: hasUnknown
      ? 'Transaction involves unknown programs — verify before signing.'
      : 'Transaction uses known Solana programs.',
    warnings: hasUnknown ? ['Unknown program detected — could be malicious'] : [],
    recommendation: hasUnknown ? 'Block or carefully review before proceeding.' : 'Appears safe to proceed.',
    details: { suspiciousElements: hasUnknown ? ['Unknown program ID'] : [] },
  };
}
