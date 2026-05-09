import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'Developers', href: '#developers' },
];

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 24, left: 0, right: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none'
    }}>
      <nav style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: 40,
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', gap: 40,
        pointerEvents: 'auto',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            times<span style={{ color: '#000', opacity: 0.5 }}>wall</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              color: 'var(--text-secondary)', textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >{l.label}</a>
          ))}
        </div>
      </nav>
    </div>
  );
}
