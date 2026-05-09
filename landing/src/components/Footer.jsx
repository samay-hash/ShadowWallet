import React from 'react';

const LINKS = {
  Product: ['Features', 'How it Works', 'AI Scanner', 'Security', 'Pricing'],
  Developers: ['API Documentation', 'SDK', 'Integration Guide', 'Status', 'GitHub'],
  Company: ['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service']
};

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', paddingTop: 40, paddingBottom: 32, borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
          
          {/* Brand */}
          <div className="reveal">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>TimesWall</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 20, maxWidth: 250 }}>
              AI-powered wallet protection built for the Solana ecosystem.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['𝕏', 'Discord', 'GitHub'].map(s => (
                <a key={s} href="#" style={{ 
                  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
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
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{category}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
          color: 'rgba(255,255,255,0.4)', fontSize: 12 
        }}>
          <div>© 2026 TimesWall. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
