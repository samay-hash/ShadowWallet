import React from 'react';

export default function Hero({ onGetStarted }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 160, position: 'relative', overflow: 'hidden'
    }}>
      <div className="container" style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        textAlign: 'center', zIndex: 1, maxWidth: 900
      }}>
        
        {/* Trusted Badge */}
        <div className="badge badge-transparent animate-fadeUp" style={{ marginBottom: 40, border: 'none', background: 'transparent' }}>
          TRUSTED BY 53 WEB3 USERS <span style={{ color: '#f59e0b', marginLeft: 6 }}>★★★★★</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fadeUp" style={{ marginBottom: 24, animationDelay: '0.1s', opacity: 0 }}>
          Skip the <span className="italic-serif" style={{ color: '#3b82f6' }}>scams</span> and<br />
          manage dApps safely.
        </h1>

        {/* Subtitle with Typewriter Effect */}
        <p className="animate-fadeUp" style={{ 
          marginBottom: 48, maxWidth: 650, 
          animationDelay: '0.2s', opacity: 0, margin: '0 auto 48px',
          minHeight: '3.2em'
        }}>
          One extension to manage everything you need for Web3 safety. From temporary 
          wallets to military-grade AI transaction scanning, TimesWall protects you in one place.
        </p>

        {/* Buttons with Flip Animation */}
        <div className="animate-fadeUp" style={{ 
          display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center',
          marginBottom: 80, animationDelay: '0.3s', opacity: 0 
        }}>
          <button onClick={onGetStarted} className="btn btn-primary btn-flip" style={{ width: 160 }}>
            <span className="btn-flip-top">Get access</span>
            <span className="btn-flip-bottom">Get access</span>
          </button>
          <a href="#demo" className="btn btn-link" style={{ fontSize: 16 }}>
            View demo
          </a>
        </div>

        {/* Blue Glow Background */}
        <div className="blue-glow" style={{ top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>


        {/* Mockup / Visual Area */}
        <div className="animate-fadeUp" style={{ 
          width: '100%', maxWidth: 800, height: 400, 
          background: '#fff', border: '8px solid #1a1a1a', 
          borderBottom: 'none', borderTopLeftRadius: 40, borderTopRightRadius: 40,
          animationDelay: '0.4s', opacity: 0, position: 'relative',
          boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
        }}>
          {/* Mockup Inner UI */}
          <div style={{ padding: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-base)', padding: '12px 20px', borderRadius: 40 }}>
                <span style={{ fontSize: 24 }}>🛡️</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Threat Blocked</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Malicious Mint...</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', padding: '12px 20px', borderRadius: 40, gap: 8 }}>
                <span style={{ width: 8, height: 8, background: 'var(--accent-lime)', borderRadius: '50%' }}></span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Shadow Wallet Active</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-base)', borderRadius: 20, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>AI Transaction Scan</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Analyzing contract signature...</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
