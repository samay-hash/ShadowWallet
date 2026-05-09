import { Router } from 'express';
import fetch from 'node-fetch';

export const insightRouter = Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

insightRouter.post('/', async (req, res) => {
  try {
    const { siteUrl, riskScore = 0 } = req.body;
    if (!siteUrl) return res.status(400).json({ error: 'siteUrl required' });

    let hostname = siteUrl;
    try { hostname = new URL(siteUrl).hostname; } catch {}

    const prompt = `You are a Web3 security expert. Analyze the risk of a user visiting "${hostname}" with a risk score of ${riskScore}/100.

Write a 2-3 sentence insight paragraph (conversational, not bullet points) explaining:
- What kind of site this likely is based on the domain
- Whether the risk score is concerning
- One specific security tip for this risk level

Keep it concise, under 60 words. Do not use markdown formatting.`;

    if (!GROQ_API_KEY) {
      // Fallback without Groq
      const fallback = riskScore >= 70
        ? `This site shows high-risk signals (${riskScore}/100). Your shadow wallet is protecting your main address. Block this transaction and avoid approving any signing requests from this domain.`
        : riskScore >= 40
        ? `This site has a moderate risk score of ${riskScore}/100. Proceed with caution — verify the contract before approving any transaction. Your shadow wallet is active.`
        : `"${hostname}" appears safe with a risk score of ${riskScore}/100. Your shadow wallet is shielding your real address. Always verify contract details before signing.`;
      return res.json({ insight: fallback });
    }

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 0.4,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('[Groq]', groqRes.status, err);
      return res.json({ insight: null });
    }

    const data = await groqRes.json();
    const insight = data.choices?.[0]?.message?.content?.trim() || null;
    return res.json({ insight });

  } catch (err) {
    console.error('[/api/site-insight]', err.message);
    return res.json({ insight: null });
  }
});
