# ShadowWallet — AI-Powered Solana Security Shield

> Disposable shadow wallets + AI transaction scanning for every Solana dApp interaction.

---

## Project Structure

```
shadowWallet/
├── backend/    → Node.js + Express + Gemini AI (Transaction analysis API)
├── extension/  → Chrome Extension (Manifest V3, React popup)
└── landing/    → Marketing landing page (React + Vite)
```

---

## Quick Start

### 1. Setup Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys:
# GEMINI_API_KEY=your_key_here
# HELIUS_API_KEY=your_key_here (optional)
```

### 2. Install Dependencies

```bash
# Backend
cd backend && npm install

# Extension
cd ../extension && npm install

# Landing
cd ../landing && npm install
```

### 3. Run Backend

```bash
cd backend && npm run dev
# Runs on http://localhost:3001
```

### 4. Build & Load Extension

```bash
cd extension && npm run build
# Then in Chrome:
# → chrome://extensions
# → Enable Developer Mode
# → "Load Unpacked" → select extension/dist folder
```

### 5. Run Landing Page

```bash
cd landing && npm run dev
# Opens at http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | AI transaction analysis |
| POST | `/api/reputation` | dApp reputation check |
| POST | `/api/simulate` | Transaction simulation |
| GET  | `/health` | Health check |

---

## How It Works

1. Extension injects `injected.js` into every page's main JS context
2. `injected.js` overrides `window.solana` with `ShadowWalletProvider`
3. dApps connect to shadow wallet — real wallet stays hidden
4. Every `signTransaction()` triggers AI analysis via backend
5. Gemini AI decodes the transaction and returns a risk score
6. User sees an approval overlay with full threat report
7. Shadow wallet can be burned after use — zero trace left

---

## API Keys Needed

- **Gemini API Key**: https://aistudio.google.com/app/apikey (free tier works)
- **Helius API Key**: https://dev.helius.xyz/ (optional — enhances RPC)
