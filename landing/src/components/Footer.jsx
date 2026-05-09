import React from 'react';

const LINKS = {
  Product: ['Features', 'How it Works', 'AI Scanner', 'Security', 'Pricing'],
  Developers: ['API Documentation', 'SDK', 'Integration Guide', 'Status', 'GitHub'],
  Company: ['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service']
};

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', paddingTop: 80, paddingBottom: 40, borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 60, marginBottom: 80 }}>
          
          {/* Brand */}
          <div className="reveal">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>ShadowWallet</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24, maxWidth: 250 }}>
              AI-powered wallet protection built for the Solana ecosystem.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['𝕏', 'Discord', 'GitHub'].map(s => (
                <a key={s} href="#" style={{ 
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none', fontSize: 14,
                  transition: 'background 0.2s'
                }}>{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, items], idx) => (
            <div key={category} className="reveal" style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>{category}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                       onMouseEnter={e => e.target.style.color = '#fff'}
                       onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="reveal" style={{ transitionDelay: '400ms' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Newsletter</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16 }}>
              Get updates on security and new features.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Enter your email" style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 16px', borderRadius: 12, color: '#fff', flex: 1, outline: 'none'
              }} />
              <button style={{
                background: 'var(--accent-lime)', color: '#000', border: 'none',
                padding: '0 20px', borderRadius: 12, fontWeight: 600, cursor: 'pointer'
              }}>→</button>
            </div>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20,
          color: 'rgba(255,255,255,0.4)', fontSize: 13 
        }}>
          <div>© 2026 ShadowWallet. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
