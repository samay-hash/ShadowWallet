import React from 'react';

const PARTNERS = [
  { name: 'Solana',     icon: '◎' },
  { name: 'Phantom',   icon: '👻' },
  { name: 'Jupiter',   icon: '♃' },
  { name: 'Magic Eden',icon: '✦' },
  { name: 'Raydium',   icon: '⬡' },
  { name: 'Orca',      icon: '🐋' },
];

export default function Partners() {
  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.015)',
      padding: '28px 24px',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Built for the<br />Solana Ecosystem
          </div>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}>
            {PARTNERS.map(p => (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.45)', fontSize: 15, fontWeight: 600,
                transition: 'color 0.2s', cursor: 'default',
                letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
              >
                <span style={{ fontSize: 18 }}>{p.icon}</span>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
