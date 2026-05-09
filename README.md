<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Y2bXQzcThxb3IydXl4NjNpbTV6ZDZwMXdsaHlmbXQ3ZDhhM2hheCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LpwBqCorPvXI0VG41Z/giphy.gif" alt="TimesWall Shield" width="120" />

  <h1 align="center">TimesWall</h1>

  <p align="center">
    <strong>Zero-Trust Web3 Security Shield & Burner Architecture for Solana</strong>
  </p>

  <p align="center">
    <a href="https://timeswall.vercel.app"><img src="https://img.shields.io/badge/Website-timeswall.vercel.app-d6f542?style=for-the-badge&logo=vercel&logoColor=black" alt="Website" /></a>
    <a href="https://github.com/samay-hash/ShadowWallet"><img src="https://img.shields.io/badge/Platform-Solana-14f195?style=for-the-badge&logo=solana&logoColor=black" alt="Solana" /></a>
    <a href="#"><img src="https://img.shields.io/badge/AI-Gemini%20%7C%20Groq-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="AI Engines" /></a>
  </p>
</div>

<br />

> **TimesWall** intercepts malicious transactions, generates ephemeral "shadow" burner wallets, and uses Real-Time AI (Gemini + Groq) to analyze bytecode before you ever sign a transaction. 

---

## 🛑 The Problem

In the current Web3 landscape, interacting with unverified dApps is like playing Russian Roulette with your primary vault.
1. **Wallet Drainers:** Malicious smart contracts camouflage drainer logic inside complex bytecodes.
2. **Identity Exposure:** Your public key and full balance history are exposed the second you connect to a dApp.
3. **Blind Signing:** Standard wallets show you unreadable hex codes or generic "Approve Transaction" screens, relying on the user's technical expertise to spot fraud.

## 🛡️ The Solution: TimesWall

TimesWall introduces a **Burner-First Architecture** combined with **AI Static Analysis**. 
We inject a secure proxy provider into the browser (`window.solana`) that intercepts requests from Phantom, Backpack, or Solflare.

Instead of exposing your real wallet, TimesWall presents an **Ephemeral Shadow Wallet** to the dApp.
If you need to transact, you fund the Shadow Wallet with *exactly* the amount needed (e.g., 0.1 SOL). Even if the dApp is malicious, your primary funds (e.g., 100 SOL) remain completely invisible and physically disconnected from the malicious site.

---

## ✨ Features

- **🌐 Provider Interception:** Overrides `window.phantom`, `window.backpack`, etc. using safe, non-blocking polling.
- **👻 Ephemeral Shadow Wallets:** Auto-generates local, zero-balance burner wallets for zero-trust browsing.
- **🧠 AI Bytecode Analysis:** Uses Gemini AI to analyze raw transaction instructions and compute a 0-100 Risk Score.
- **💬 Conversational Threat Intel:** Groq AI generates human-readable security insights tailored to the specific dApp domain.
- **⚡ 1-Click Airdrop/Funding:** Built-in QR capabilities and Devnet Airdrops for rapid testing and funding.
- **🖤 Premium Stealth UI:** Cinematic, dark-mode, Backpack-inspired UI built directly into a lightweight Chrome extension.

---

## 🏗️ Architecture

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW50ZXJmYWNlX2FuaW1hdGlvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aD2saalEvTe882k/giphy.gif" alt="Architecture Flow" width="600" style="border-radius: 12px; border: 1px solid #333;" />
</div>

1. **dApp Request:** `window.solana.signTransaction()` is called.
2. **Interception:** TimesWall proxy halts the request.
3. **AI Scan:** Transaction bytes are sent to the Backend (Render). Gemini AI computes Risk Score.
4. **User Verdict:** User is presented with a Risk UI (Safe / Warning / Danger).
5. **Execution:** If approved, the *Shadow Wallet* signs the transaction, shielding the main wallet.

---

## 🚀 Quick Start (Local Development)

### 1. Setup Backend
\`\`\`bash
cd backend
npm install
npm start
\`\`\`
*(Requires \`.env\` with \`GEMINI_API_KEY\`, \`GROQ_API_KEY\`, \`HELIUS_RPC_URL\`)*

### 2. Setup Landing Page
\`\`\`bash
cd landing
npm install
npm run dev
\`\`\`

### 3. Load Extension
1. Go to \`chrome://extensions\` in your Chromium browser.
2. Enable **Developer Mode** (top right).
3. Click **Load unpacked** and select the \`/extension/dist\` folder.

---

## 🌐 Live Demo

- **Landing Page:** [timeswall.vercel.app](https://timeswall.vercel.app)
- **API Endpoint:** Hosted on Render
- **Extension:** Downloadable directly from the landing page.

---

<div align="center">
  <p>Built with 🖤 for the Solana Global Hackathon.</p>
</div>
