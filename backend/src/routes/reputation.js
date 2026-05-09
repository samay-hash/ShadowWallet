import { Router } from 'express';

export const reputationRouter = Router();

// Known scam/phishing domains (community-sourced, in production this would be on-chain)
const KNOWN_SCAMS = new Set([
  'magic-eden-mint.xyz', 'phantom-airdrop.com', 'sol-airdrop.net',
  'solana-nft-mint.io', 'free-sol-drop.com', 'nft-claim-solana.xyz',
  'opensea-solana.com', 'phantom-wallet-app.net', 'solana-airdrop.pro',
]);

const SUSPICIOUS_KEYWORDS = [
  'airdrop', 'free-sol', 'claim-nft', 'mint-free', 'wallet-verify',
  'connect-phantom', 'sol-reward', 'nft-giveaway',
];

export const reputationRouter2 = Router(); // alias

reputationRouter.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    let domain;
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const flags = [];
    let riskScore = 0;

    // Check known scams
    if (KNOWN_SCAMS.has(domain)) {
      flags.push({ type: 'KNOWN_SCAM', message: 'This domain is on the known scam list', severity: 'critical' });
      riskScore = 100;
    }

    // Check suspicious keywords in domain
    for (const kw of SUSPICIOUS_KEYWORDS) {
      if (domain.includes(kw)) {
        flags.push({ type: 'SUSPICIOUS_KEYWORD', message: `Domain contains suspicious keyword: "${kw}"`, severity: 'high' });
        riskScore = Math.max(riskScore, 70);
      }
    }

    // Check TLD
    const suspiciousTLDs = ['.xyz', '.top', '.click', '.pw', '.tk', '.ml', '.ga', '.cf'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      flags.push({ type: 'SUSPICIOUS_TLD', message: `Suspicious TLD detected: ${domain.split('.').pop()}`, severity: 'medium' });
      riskScore = Math.max(riskScore, 50);
    }

    // HTTPS check
    if (!url.startsWith('https://')) {
      flags.push({ type: 'NO_HTTPS', message: 'Site is not using HTTPS', severity: 'high' });
      riskScore = Math.max(riskScore, 60);
    }

    const verdict = riskScore >= 80 ? 'DANGER' : riskScore >= 40 ? 'WARNING' : 'SAFE';

    return res.json({
      success: true,
      domain,
      riskScore,
      verdict,
      flags,
      isKnownScam: KNOWN_SCAMS.has(domain),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/reputation]', err);
    return res.status(500).json({ error: err.message });
  }
});
