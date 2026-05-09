(function() {
  const pendingRequests = /* @__PURE__ */ new Map();
  function sendToExtension(type, payload = {}) {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).slice(2);
      const timeout = setTimeout(() => {
        pendingRequests.delete(requestId);
        reject(new Error("ShadowWallet: extension response timeout"));
      }, 15e3);
      pendingRequests.set(requestId, { resolve, reject, timeout });
      window.postMessage({ type: `SW_${type}`, payload, requestId }, "*");
    });
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const { type, requestId, payload } = event.data || {};
    if (!(type == null ? void 0 : type.endsWith("_RESPONSE")) || !requestId) return;
    const pending = pendingRequests.get(requestId);
    if (!pending) return;
    clearTimeout(pending.timeout);
    pendingRequests.delete(requestId);
    if (payload == null ? void 0 : payload.error) pending.reject(new Error(payload.error));
    else pending.resolve(payload);
  });
  let siteReputation = { riskScore: 0, verdict: "SAFE" };
  window.addEventListener("message", (event) => {
    var _a;
    if (((_a = event.data) == null ? void 0 : _a.type) === "SW_REPUTATION_RESULT") {
      siteReputation = event.data.payload || siteReputation;
    }
  });
  class ShadowWalletProvider {
    constructor(originalProvider) {
      this._original = originalProvider;
      this.isPhantom = true;
      this.isShadowWallet = true;
      this.isConnected = false;
      this._publicKey = null;
      this._connectHandlers = [];
      this._disconnectHandlers = [];
      this._accountChangeHandlers = [];
      console.log(
        "%c🛡️ ShadowWallet Active — Your main wallet is protected.",
        "color: #8b5cf6; font-weight: bold; font-size: 13px;"
      );
    }
    get publicKey() {
      return this._publicKey;
    }
    // ─── connect() ─────────────────────────────────────────────────────────────
    async connect(options) {
      var _a;
      try {
        const result = await sendToExtension("GET_SHADOW_PUBLIC_KEY");
        if (!(result == null ? void 0 : result.publicKey)) {
          const activated = await sendToExtension("ACTIVATE_SHADOW");
          this._publicKey = new FakePublicKey(((_a = activated == null ? void 0 : activated.wallet) == null ? void 0 : _a.publicKey) || "ShadowDefault");
        } else {
          this._publicKey = new FakePublicKey(result.publicKey);
        }
        this.isConnected = true;
        console.log("%c🛡️ Shadow wallet connected:", "color: #8b5cf6", this._publicKey.toBase58());
        return { publicKey: this._publicKey };
      } catch (err) {
        throw new Error("ShadowWallet: connection failed — " + err.message);
      }
    }
    // ─── disconnect() ──────────────────────────────────────────────────────────
    async disconnect() {
      this.isConnected = false;
      this._publicKey = null;
      this._disconnectHandlers.forEach((h) => h());
    }
    // ─── signTransaction() ─────────────────────────────────────────────────────
    async signTransaction(transaction) {
      return this._interceptAndSign([transaction]).then((txs) => txs[0]);
    }
    // ─── signAllTransactions() ─────────────────────────────────────────────────
    async signAllTransactions(transactions) {
      return this._interceptAndSign(transactions);
    }
    // ─── signAndSendTransaction() ──────────────────────────────────────────────
    async signAndSendTransaction(transaction, options) {
      const [signed] = await this._interceptAndSign([transaction]);
      return { signature: "ShadowWallet_protected_" + Date.now() };
    }
    // ─── Core interception logic ───────────────────────────────────────────────
    async _interceptAndSign(transactions) {
      var _a;
      const siteUrl = window.location.href;
      for (const tx of transactions) {
        let txBase64 = "";
        try {
          const serialized = (_a = tx.serialize) == null ? void 0 : _a.call(tx, { requireAllSignatures: false, verifySignatures: false });
          txBase64 = btoa(String.fromCharCode(...new Uint8Array(serialized)));
        } catch {
          txBase64 = "";
        }
        const approved = await this._showApprovalUI(txBase64, siteUrl);
        if (!approved) {
          throw new Error("ShadowWallet: Transaction blocked by user");
        }
      }
      return transactions;
    }
    // ─── Approval UI overlay ───────────────────────────────────────────────────
    async _showApprovalUI(txBase64, siteUrl) {
      return new Promise(async (resolve) => {
        let analysis = { riskScore: 0, verdict: "SAFE", summary: "Analyzing...", warnings: [] };
        const overlay = createOverlay(analysis, siteUrl, resolve);
        document.body.appendChild(overlay);
        try {
          const result = await sendToExtension("ANALYZE_TRANSACTION", { transaction: txBase64, siteUrl });
          analysis = (result == null ? void 0 : result.analysis) || analysis;
          updateOverlay(overlay, analysis);
        } catch {
          updateOverlay(overlay, {
            riskScore: 30,
            verdict: "WARNING",
            summary: "Could not analyze — AI service offline.",
            warnings: ["Manual review recommended"]
          });
        }
      });
    }
    // ─── Event handlers (Phantom-compatible API) ───────────────────────────────
    on(event, handler) {
      if (event === "connect") this._connectHandlers.push(handler);
      if (event === "disconnect") this._disconnectHandlers.push(handler);
      if (event === "accountChanged") this._accountChangeHandlers.push(handler);
    }
    off(event, handler) {
      if (event === "connect") this._connectHandlers = this._connectHandlers.filter((h) => h !== handler);
    }
    emit(event, ...args) {
    }
    request(method, params) {
      var _a, _b;
      return (_b = (_a = this._original) == null ? void 0 : _a.request) == null ? void 0 : _b.call(_a, method, params);
    }
  }
  class FakePublicKey {
    constructor(base58) {
      this._base58 = base58;
    }
    toBase58() {
      return this._base58;
    }
    toString() {
      return this._base58;
    }
    toJSON() {
      return this._base58;
    }
    equals(other) {
      var _a;
      return this._base58 === ((_a = other == null ? void 0 : other.toBase58) == null ? void 0 : _a.call(other));
    }
  }
  function getRiskColor(score) {
    if (score >= 70) return "#ff3366";
    if (score >= 40) return "#f59e0b";
    return "#10b981";
  }
  function createOverlay(analysis, siteUrl, resolve) {
    var _a, _b;
    const el = document.createElement("div");
    el.id = "sw-approval-overlay";
    el.innerHTML = getOverlayHTML(analysis, siteUrl);
    (_a = el.querySelector("#sw-block-btn")) == null ? void 0 : _a.addEventListener("click", () => {
      el.remove();
      resolve(false);
    });
    (_b = el.querySelector("#sw-approve-btn")) == null ? void 0 : _b.addEventListener("click", () => {
      el.remove();
      resolve(true);
    });
    return el;
  }
  function updateOverlay(el, analysis) {
    const scoreEl = el.querySelector("#sw-risk-score");
    const verdictEl = el.querySelector("#sw-verdict");
    const summaryEl = el.querySelector("#sw-summary");
    const warningsEl = el.querySelector("#sw-warnings");
    const approveBtn = el.querySelector("#sw-approve-btn");
    if (scoreEl) {
      scoreEl.textContent = analysis.riskScore;
      scoreEl.style.color = getRiskColor(analysis.riskScore);
    }
    if (verdictEl) {
      verdictEl.textContent = analysis.verdict;
      verdictEl.style.color = getRiskColor(analysis.riskScore);
    }
    if (summaryEl) summaryEl.textContent = analysis.summary || "";
    if (warningsEl) {
      warningsEl.innerHTML = (analysis.warnings || []).map(
        (w) => `<div style="background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.3);border-radius:6px;padding:6px 10px;font-size:12px;color:#fca5a5;margin-bottom:6px">⚠️ ${w}</div>`
      ).join("");
    }
    if (approveBtn && analysis.riskScore >= 70) {
      approveBtn.style.opacity = "0.4";
      approveBtn.textContent = "⚠️ Proceed Anyway";
    }
  }
  function getOverlayHTML(analysis, siteUrl) {
    const domain = (() => {
      try {
        return new URL(siteUrl).hostname;
      } catch {
        return siteUrl;
      }
    })();
    return `
    <div style="
      position: fixed; inset: 0; z-index: 2147483647;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="
        background: #f5f2eb;
        border: 2px solid #1a1a1a;
        border-radius: 24px; padding: 32px; width: 440px; max-width: 90vw;
        box-shadow: 0 40px 80px rgba(0,0,0,0.4);
      ">
        <!-- Header -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
          <div style="font-size:32px">🛡️</div>
          <div>
            <div style="color:#1a1a1a;font-weight:800;font-size:17px;letter-spacing:-0.02em">ShadowWallet Security Check</div>
            <div style="color:#5a5a5a;font-size:13px;font-weight:600">${domain}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div id="sw-risk-score" style="font-size:32px;font-weight:800;color:#10b981;letter-spacing:-0.03em">${analysis.riskScore}</div>
            <div style="color:#5a5a5a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Risk Score</div>
          </div>
        </div>

        <!-- Verdict badge -->
        <div id="sw-verdict" style="
          display:inline-block;padding:6px 16px;border-radius:40px;font-size:12px;font-weight:800;
          background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.4);
          margin-bottom:16px;letter-spacing:0.05em;text-transform:uppercase;
        ">${analysis.verdict}</div>

        <!-- Summary -->
        <div id="sw-summary" style="
          color:#1a1a1a;font-size:14px;line-height:1.6;font-weight:500;
          background:rgba(0,0,0,0.04);border-radius:12px;padding:12px 16px;margin-bottom:14px;border:1px solid rgba(0,0,0,0.08);
        ">${analysis.summary || "Scanning transaction with AI..."}</div>

        <!-- Warnings -->
        <div id="sw-warnings" style="margin-bottom:20px">
          <div style="color:#5a5a5a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:8px">AI Findings</div>
        </div>

        <!-- Shadow wallet info -->
        <div style="
          background:#fff;border:1px solid rgba(0,0,0,0.1);
          border-radius:12px;padding:10px 14px;margin-bottom:20px;font-size:13px;color:#5a5a5a;font-weight:500;
        ">
          🔒 Your main wallet is hidden. dApp only sees your shadow wallet.
        </div>

        <!-- Action buttons -->
        <div style="display:flex;gap:12px">
          <button id="sw-block-btn" style="
            flex:1;padding:14px;border-radius:40px;border:1px solid rgba(255,51,102,0.4);
            background:rgba(255,51,102,0.1);color:#ff3366;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;
          ">🛡️ Block Transaction</button>
          <button id="sw-approve-btn" style="
            flex:1;padding:14px;border-radius:40px;border:1px solid #1a1a1a;
            background:#d6f542;color:#000;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;
          ">✅ Approve</button>
        </div>
      </div>
    </div>`;
  }
  function tryOverride(obj, key) {
    if (!obj) return;
    try {
      const original = obj[key];
      if (original == null ? void 0 : original.isShadowWallet) return;
      const shadow = new ShadowWalletProvider(original);
      Object.defineProperty(obj, key, {
        value: shadow,
        writable: false,
        configurable: false
      });
    } catch (_) {
    }
  }
  tryOverride(window, "solana");
  tryOverride(window.phantom, "solana");
  tryOverride(window.backpack, "solana");
  tryOverride(window.xnft, "solana");
  tryOverride(window.solflare, "solana");
  tryOverride(window.glowSolana, "provider");
  tryOverride(window.braveSolana, "provider");
  setInterval(() => {
    tryOverride(window, "solana");
    if (window.phantom) tryOverride(window.phantom, "solana");
    if (window.backpack) tryOverride(window.backpack, "solana");
    if (window.xnft) tryOverride(window.xnft, "solana");
    if (window.solflare) tryOverride(window.solflare, "solana");
    if (window.glowSolana) tryOverride(window.glowSolana, "provider");
    if (window.braveSolana) tryOverride(window.braveSolana, "provider");
  }, 1e3);
  console.log("%c🛡️ ShadowWallet ACTIVE — Protected: Phantom · Backpack · Solflare · Glow · Brave Wallet", "color:#8b5cf6;font-weight:bold;font-size:13px");
})();
