(function() {
  function injectScript(src) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(src);
    script.type = "text/javascript";
    (document.head || document.documentElement).prepend(script);
    script.onload = () => script.remove();
  }
  injectScript("injected.js");
  window.addEventListener("message", async (event) => {
    var _a, _b;
    if (event.source !== window) return;
    if (!((_b = (_a = event.data) == null ? void 0 : _a.type) == null ? void 0 : _b.startsWith("SW_"))) return;
    const { type, payload, requestId } = event.data;
    let response;
    try {
      response = await chrome.runtime.sendMessage({ type: type.replace("SW_", ""), ...payload });
    } catch (err) {
      response = { error: err.message };
    }
    window.postMessage({
      type: `${type}_RESPONSE`,
      requestId,
      payload: response
    }, "*");
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkReputation);
  } else {
    checkReputation();
  }
  async function checkReputation() {
    try {
      const result = await chrome.runtime.sendMessage({
        type: "CHECK_REPUTATION",
        url: window.location.href
      });
      if ((result == null ? void 0 : result.riskScore) >= 70) {
        injectWarningBanner(result);
      }
      window.postMessage({ type: "SW_REPUTATION_RESULT", payload: result }, "*");
    } catch (_) {
    }
  }
  function injectWarningBanner(reputation) {
    var _a, _b, _c;
    if (document.getElementById("shadowwallet-warning")) return;
    const banner = document.createElement("div");
    banner.id = "shadowwallet-warning";
    banner.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
        background: linear-gradient(135deg, #1a0020, #2d0035);
        border-bottom: 2px solid #ff3366;
        color: #fff; font-family: -apple-system, sans-serif;
        padding: 12px 20px; display: flex; align-items: center; gap: 12px;
        box-shadow: 0 4px 30px rgba(255,51,102,0.4);
      ">
        <span style="font-size: 20px;">🛡️</span>
        <div style="flex: 1">
          <strong style="color: #ff3366">⚠️ ShadowWallet Warning</strong>
          <span style="margin-left: 8px; opacity: 0.85; font-size: 14px;">
            This site has a risk score of <strong>${reputation.riskScore}/100</strong>.
            ${((_b = (_a = reputation.flags) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) || "Proceed with caution."}
          </span>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 12px;
        ">Dismiss</button>
      </div>
    `;
    ((_c = document.body) == null ? void 0 : _c.prepend(banner)) || document.documentElement.prepend(banner);
  }
})();
