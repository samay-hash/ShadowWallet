import React, { useState } from 'react';

export default function InstallGuide() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '📦',
      title: 'Download the ZIP',
      desc: 'Click the button below to download the ShadowWallet extension ZIP. It\'s completely free — no Chrome Web Store, no payment.',
      action: (
        <a
          href="/shadowwallet-extension.zip"
          download="shadowwallet-extension.zip"
          className="btn btn-primary"
          style={{ display: 'inline-flex', marginTop: 16 }}
        >
          📥 Download Extension ZIP (Free)
        </a>
      ),
    },
    {
      icon: '📂',
      title: 'Extract the ZIP',
      desc: 'Double-click the downloaded ZIP file to extract it. You\'ll get a folder called "extension/dist". Remember where you extract it.',
      code: '~/Downloads/shadowwallet-extension/extension/dist/'
    },
    {
      icon: '⚙️',
      title: 'Open Chrome Extensions',
      desc: 'In Chrome (or Brave/Edge), go to the extensions page and enable Developer Mode in the top-right corner.',
      code: 'chrome://extensions  →  Enable "Developer Mode"'
    },
    {
      icon: '📁',
      title: 'Load Unpacked',
      desc: 'Click "Load unpacked" and select the "dist" folder you extracted in step 2.',
      code: 'Load unpacked → Select "extension/dist" folder'
    },
    {
      icon: '🛡️',
      title: 'You\'re Protected!',
      desc: 'Pin the ShadowWallet icon to your toolbar. Visit any Solana dApp — your real wallet is now automatically hidden!',
    },
  ];

  return (
    <section id="developers" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="badge reveal" style={{ marginBottom: 24 }}>FREE INSTALLATION — NO CHROME STORE</div>
          <h2 className="reveal">
            Install in <span className="italic-serif">5 minutes</span>, for free.
          </h2>
          <p className="reveal" style={{ maxWidth: 560, margin: '20px auto 0' }}>
            ShadowWallet is open-source. No $5 Chrome Web Store fee. 
            Download → Extract → Load. That's it.
          </p>
        </div>

        {/* Step Progress */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setStep(i)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid',
                  borderColor: i <= step ? 'var(--border-strong)' : 'var(--border)',
                  background: i === step ? 'var(--accent-lime)' : i < step ? 'var(--text-primary)' : 'transparent',
                  color: i < step ? '#fff' : 'var(--text-primary)',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {i < step ? '✓' : i + 1}
              </button>
              {i < steps.length - 1 && (
                <div style={{ width: 40, height: 2, background: i < step ? 'var(--border-strong)' : 'var(--border)', transition: 'all 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Current Step Card */}
        <div className="card reveal" style={{
          maxWidth: 680, margin: '0 auto', padding: '48px 40px', textAlign: 'center',
          border: '2px solid var(--border-strong)', transition: 'all 0.4s'
        }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>{steps[step].icon}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Step {step + 1} of {steps.length}
          </div>
          <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>{steps[step].title}</h3>
          <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>{steps[step].desc}</p>
          
          {steps[step].code && (
            <div style={{
              marginTop: 24, background: 'var(--bg-base)', borderRadius: 12,
              padding: '14px 24px', fontFamily: 'monospace', fontSize: 14,
              color: 'var(--text-primary)', border: '1px solid var(--border)',
              fontWeight: 600
            }}>
              {steps[step].code}
            </div>
          )}
          
          {steps[step].action && steps[step].action}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
                ← Previous
              </button>
            )}
            {step < steps.length - 1 && (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
                Next Step →
              </button>
            )}
            {step === steps.length - 1 && (
              <a href="#" className="btn btn-primary">
                🚀 Go to Dashboard
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
