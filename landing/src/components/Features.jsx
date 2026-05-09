import React from 'react';

const FEATURES = [
  {
    icon: '🕵️',
    title: 'Burner Wallets on Demand',
    desc: 'Generate unlimited disposable wallets instantly. Connect to any dApp without exposing your main balance or identity.'
  },
  {
    icon: '🤖',
    title: 'AI Threat Intelligence',
    desc: 'Every transaction is analyzed by Gemini AI before you sign. It reads the smart contract and warns you of drainers.'
  },
  {
    icon: '🔗',
    title: 'On-Chain Blacklist',
    desc: 'When our AI blocks a scam, the attacker\'s address is permanently logged to our Solana Smart Contract Registry.'
  }
];

export default function Features() {
  return (
    <section id="features" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="badge" style={{ marginBottom: 24 }}>FEATURES</div>
          <h2>Everything you need <br/>to stay <span className="italic-serif">secure</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="card reveal" style={{ transitionDelay: `${idx * 100}ms`, border: '1px solid var(--border-strong)' }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 16, background: 'var(--bg-base)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 24, marginBottom: 24, border: '1px solid var(--border)'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ marginBottom: 12 }}>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
