import React from 'react';

const STEPS = [
  { id: 1, title: 'Connect Main Wallet', desc: 'Connect your main wallet securely to ShadowWallet.', icon: '🔗' },
  { id: 2, title: 'Generate Shadow Wallet', desc: 'We create a temporary wallet with limited funds for you.', icon: '👻' },
  { id: 3, title: 'Interact Safely', desc: 'Use the shadow wallet to explore dApps safely.', icon: '🌐' },
  { id: 4, title: 'AI Protection', desc: 'Our AI scans every transaction in real-time for threats.', icon: '🤖' },
  { id: 5, title: 'Auto Destroy', desc: 'Wallet is automatically burned after use. You stay safe.', icon: '🗑️' }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: 'var(--bg-base)', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        <div className="badge reveal" style={{ marginBottom: 24 }}>HOW IT WORKS</div>
        <h2 className="reveal" style={{ marginBottom: 80 }}>
          Simple steps for <br/><span className="italic-serif">maximum</span> protection
        </h2>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          {/* Connecting Line */}
          <div style={{
            position: 'absolute', top: 32, left: '10%', right: '10%', height: 2,
            background: 'var(--border)', zIndex: 0
          }} className="reveal" />

          {STEPS.map((step, idx) => (
            <div key={step.id} className="reveal" style={{ 
              flex: 1, minWidth: 160, position: 'relative', zIndex: 1,
              transitionDelay: `${idx * 150}ms`
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                margin: '0 auto 24px', position: 'relative',
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}>
                {step.icon}
                <div style={{
                  position: 'absolute', top: -4, right: -4, background: 'var(--accent-lime)',
                  color: '#000', width: 24, height: 24, borderRadius: '50%', border: '1px solid #000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 'bold'
                }}>
                  {step.id}
                </div>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ 
          marginTop: 80, padding: 24, background: 'rgba(255,255,255,0.5)', 
          borderRadius: 24, border: '1px solid var(--border)',
          display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15,
          color: 'var(--text-secondary)'
        }}>
          🔒 Your <strong style={{color: 'var(--text-primary)'}}>main wallet</strong> is never exposed to dApps. Shadow wallets act as a protective layer — scam the scammer.
        </div>
        
      </div>
    </section>
  );
}
