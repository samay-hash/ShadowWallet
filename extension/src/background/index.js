// ShadowWallet Background Service Worker
// Manages shadow keypairs, session state, and API calls

const BACKEND_URL = process.env.BACKEND_URL || 'https://shadowwallet-a28d.onrender.com';
const STORAGE_KEY = 'shadowwallet_state';

// ─── Keypair Generation (Web Crypto, no Node deps) ───────────────────────────
async function generateShadowKeypair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'Ed25519' },
    true,
    ['sign', 'verify']
  );
  const publicKeyBuffer = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  return {
    publicKey: bufferToBase58(new Uint8Array(publicKeyBuffer)),
    privateKeyPkcs8: Array.from(new Uint8Array(privateKeyBuffer)),
    createdAt: Date.now(),
    id: crypto.randomUUID(),
  };
}

// Simple Base58 encoder (Solana-compatible alphabet)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function bufferToBase58(buffer) {
  const bytes = Array.from(buffer);
  let result = '';
  let n = BigInt('0x' + bytes.map(b => b.toString(16).padStart(2, '0')).join(''));
  const base = BigInt(58);
  while (n > 0n) {
    result = BASE58_ALPHABET[Number(n % base)] + result;
    n /= base;
  }
  for (const byte of bytes) {
    if (byte === 0) result = '1' + result;
    else break;
  }
  return result || '1';
}

// ─── State Management ─────────────────────────────────────────────────────────
async function getState() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || {
    isActive: false,
    shadowWallet: null,
    sessions: [],
    blockedCount: 0,
    allowedCount: 0,
    reputationCache: {},
    activityLog: [],
  };
}

async function saveState(state) {
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

// ─── API Calls ────────────────────────────────────────────────────────────────
async function callAnalyze(transaction, siteUrl, walletAddress) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction, siteUrl, walletAddress }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SW] analyze failed:', err.message);
    return {
      success: false,
      analysis: {
        riskScore: 50,
        verdict: 'WARNING',
        summary: 'Could not reach ShadowWallet AI — proceed with caution.',
        warnings: ['AI analysis unavailable'],
        recommendation: 'Verify this transaction manually before signing.',
      },
    };
  }
}

async function callReputation(url) {
  try {
    const state = await getState();
    if (state.reputationCache[url]) return state.reputationCache[url];

    const res = await fetch(`${BACKEND_URL}/api/reputation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();

    // Cache for 10 minutes
    state.reputationCache[url] = { ...data, cachedAt: Date.now() };
    await saveState(state);
    return data;
  } catch {
    return { riskScore: 0, verdict: 'SAFE', flags: [] };
  }
}

// ─── Message Handler ──────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender).then(sendResponse).catch(err => {
    sendResponse({ error: err.message });
  });
  return true; // Keep channel open for async
});

async function handleMessage(msg, sender) {
  const state = await getState();

  switch (msg.type) {
    case 'GET_STATE':
      return state;

    case 'ACTIVATE_SHADOW': {
      const keypair = await generateShadowKeypair();
      state.isActive = true;
      state.shadowWallet = keypair;
      state.sessions.unshift({ ...keypair, tabId: sender.tab?.id });
      if (state.sessions.length > 20) state.sessions.pop();
      await saveState(state);
      return { success: true, wallet: keypair };
    }

    case 'DEACTIVATE_SHADOW': {
      state.isActive = false;
      state.shadowWallet = null;
      await saveState(state);
      return { success: true };
    }

    case 'GET_SHADOW_PUBLIC_KEY': {
      if (!state.isActive || !state.shadowWallet) return { publicKey: null };
      return { publicKey: state.shadowWallet.publicKey };
    }

    case 'ANALYZE_TRANSACTION': {
      const { transaction, siteUrl } = msg;
      const result = await callAnalyze(transaction, siteUrl, state.shadowWallet?.publicKey);

      const analysis = result.analysis || {};
      
      // Log activity
      const activity = {
        action: analysis.riskScore >= 70 ? 'Threat Blocked' : 'Transaction Allowed',
        site: siteUrl || 'unknown',
        type: analysis.riskScore >= 70 ? 'blocked' : 'allowed',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      state.activityLog = state.activityLog || [];
      state.activityLog.unshift(activity);
      if (state.activityLog.length > 50) state.activityLog.pop();

      // Show notification for dangerous transactions
      if (analysis.riskScore >= 70) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: '🚨 ShadowWallet — DANGER DETECTED',
          message: analysis.summary || 'This transaction appears malicious.',
          priority: 2,
        });
        state.blockedCount++;
      } else {
        state.allowedCount++;
      }
      await saveState(state);
      return result;
    }

    case 'CHECK_REPUTATION': {
      const { url } = msg;
      return await callReputation(url);
    }

    case 'BURN_WALLET': {
      state.shadowWallet = null;
      state.isActive = false;
      await saveState(state);
      return { success: true };
    }

    case 'GET_STATS':
      return {
        blockedCount: state.blockedCount,
        allowedCount: state.allowedCount,
        sessionsCount: state.sessions.length,
      };

    default:
      return { error: 'Unknown message type' };
  }
}

// ─── Extension Install Handler ────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[ShadowWallet] Installed');
  const state = await getState();
  if (!state.shadowWallet) {
    const keypair = await generateShadowKeypair();
    state.isActive = true;
    state.shadowWallet = keypair;
    await saveState(state);
  }
});
