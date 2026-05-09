import React from 'react';

export default function CTA({ onGetStarted }) {
  return (
    <section className="section" style={{ background: 'var(--bg-base)', padding: '160px 0' }}>
      <div className="container">
        <div className="card reveal" style={{ 
          textAlign: 'center', padding: '80px 40px', 
          background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.05)'
        }}>
          <div className="badge" style={{ marginBottom: 24 }}>READY TO STAY SAFE?</div>
          <h2 style={{ marginBottom: 24 }}>
            Join the future of <br/><span className="italic-serif">secure</span> Web3 exploration
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 40px', fontSize: 18 }}>
            Never worry about wallet draining or scams again. ShadowWallet protects you automatically.
          </p>
          
          <button onClick={onGetStarted} className="btn btn-primary" style={{ padding: '18px 40px', fontSize: 18 }}>
            ⚡ Launch Shadow Mode
          </button>
          
          <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            It's free to get started. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
