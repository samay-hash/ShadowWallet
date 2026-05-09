import { Router } from 'express';
import { Connection, VersionedTransaction, Transaction } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

export const simulateRouter = Router();

const getRPC = () =>
  process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

simulateRouter.post('/', async (req, res) => {
  try {
    const { transaction, network = 'mainnet' } = req.body;
    if (!transaction) return res.status(400).json({ error: 'transaction required' });

    const rpcUrl = network === 'devnet'
      ? 'https://api.devnet.solana.com'
      : getRPC();

    const connection = new Connection(rpcUrl, 'confirmed');
    const buffer = Buffer.from(transaction, 'base64');

    let simResult;
    try {
      const vtx = VersionedTransaction.deserialize(buffer);
      simResult = await connection.simulateTransaction(vtx, { commitment: 'confirmed' });
    } catch {
      const tx = Transaction.from(buffer);
      simResult = await connection.simulateTransaction(tx);
    }

    const { err, logs, unitsConsumed } = simResult.value;

    return res.json({
      success: true,
      simulation: {
        wouldSucceed: !err,
        error: err || null,
        logs: logs || [],
        unitsConsumed: unitsConsumed || 0,
        networkFee: ((unitsConsumed || 0) / 1_000_000 * 0.000005).toFixed(8) + ' SOL',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/simulate]', err);
    return res.status(500).json({ error: err.message });
  }
});
