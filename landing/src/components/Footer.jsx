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
              <a href="https://github.com/samay-hash/ShadowWallet" target="_blank" rel="noopener noreferrer" style={{ 
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://x.com/ChemistGamer1" target="_blank" rel="noopener noreferrer" style={{ 
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
              <a href="https://www.instagram.com/samay.samrat" target="_blank" rel="noopener noreferrer" style={{ 
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
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
