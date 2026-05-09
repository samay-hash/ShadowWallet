import { Router } from 'express';
import { parseTransaction, analyzeWithGemini } from '../services/gemini.js';

export const analyzeRouter = Router();

analyzeRouter.post('/', async (req, res) => {
  try {
    const { transaction, siteUrl, walletAddress } = req.body;

    if (!transaction) {
      return res.status(400).json({ error: 'transaction (base64) is required' });
    }

    const parsedTx = await parseTransaction(transaction);
    const analysis = await analyzeWithGemini({
      parsedTx,
      siteUrl: siteUrl || 'unknown',
      rawBase64: transaction,
    });

    return res.json({
      success: true,
      siteUrl,
      walletAddress,
      analysis,
      parsedTx,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/analyze]', err);
    return res.status(500).json({ error: err.message });
  }
});
