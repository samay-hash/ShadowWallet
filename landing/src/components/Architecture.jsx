import React from 'react';

export default function Architecture() {
  return (
    <section id="security" className="section" style={{ background: 'var(--bg-base)' }}>
      <div className="container">
        
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="badge reveal" style={{ marginBottom: 24 }}>HOW YOUR DATA STAYS SAFE</div>
          <h2 className="reveal">
            Zero-knowledge design. <br/><span className="italic-serif" style={{ color: '#ff3366' }}>Nothing</span> is stored on our servers.
          </h2>
          <p className="reveal" style={{ maxWidth: 600, margin: '24px auto 0', fontSize: 16 }}>
            Your private keys, seed phrases, and wallet addresses never leave your device. 
            Here's the exact technical flow — every step, fully transparent.
          </p>
        </div>

        {/* Architecture Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          
          {/* Step 1 */}
          <ArchStep
            number="01"
            direction="right"
            icon="🌐"
            title="You Visit a dApp"
            subtitle="e.g. magic eden, jupiter, raydium"
            desc="You open any Solana dApp in your Chrome browser. The site tries to access your Phantom wallet via window.solana."
            tag="Your Device Only"
            tagColor="#10b981"
            storage="Stored: NOWHERE. This happens 100% in your browser tab."
          />

          {/* Arrow */}
          <div className="reveal" style={{ textAlign: 'center', fontSize: 28, color: 'var(--text-muted)', padding: '8px 0' }}>↓</div>

          {/* Step 2 */}
          <ArchStep
            number="02"
            direction="left"
            icon="🕵️"
            title="Extension Intercepts window.solana"
            subtitle="injected.js — runs in your browser memory"
            desc="Before the dApp connects, our extension replaces window.solana with a Shadow Wallet Provider. The dApp has NO IDEA. It gets a burner address instead of your real one."
            tag="Browser Memory Only"
            tagColor="#3b82f6"
            storage="Stored: In Chrome extension's local storage (chrome.storage.local). Only on YOUR computer."
          />

          <div className="reveal" style={{ textAlign: 'center', fontSize: 28, color: 'var(--text-muted)', padding: '8px 0' }}>↓</div>

          {/* Step 3 */}
          <ArchStep
            number="03"
            direction="right"
            icon="🤖"
            title="AI Scans Every Transaction"
            subtitle="Gemini AI — called only when you click Sign"
            desc="When you try to sign a transaction, we send ONLY the raw transaction bytes (not your keys!) to Gemini AI. It reads the contract instructions and detects malicious patterns like full-balance drains."
            tag="Transaction Data Only (No Keys)"
            tagColor="#f59e0b"
            storage="Sent to AI: Only anonymous transaction bytes. Your private key is NEVER sent. The AI cannot identify you."
          />

          <div className="reveal" style={{ textAlign: 'center', fontSize: 28, color: 'var(--text-muted)', padding: '8px 0' }}>↓</div>

          {/* Step 4 */}
          <ArchStep
            number="04"
            direction="left"
            icon="⛓️"
            title="Threat Logged On-Chain (Optional)"
            subtitle="Solana Blockchain — permanent public record"
            desc="If a transaction is confirmed malicious, the scammer's CONTRACT ADDRESS (not your address) is permanently recorded to our Solana smart contract. This protects every other user worldwide."
            tag="On-Chain: Public & Permanent"
            tagColor="#8b5cf6"
            storage="Stored On-Chain: Only the scammer's address + threat type. YOUR identity is never recorded."
          />

        </div>

        {/* Privacy Promise Box */}
        <div className="card reveal" style={{ 
          marginTop: 80, background: 'var(--bg-surface)',
          border: '2px solid var(--border-strong)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, padding: 40
        }}>
          {[
            { icon: '🔑', title: 'Zero Private Key Access', desc: 'We never ask for, store, or transmit your seed phrase or private key. Ever.' },
            { icon: '🙈', title: 'No Identity Tracking', desc: 'No accounts, no email, no cookies. You are completely anonymous to us.' },
            { icon: '💾', title: 'Local-First Storage', desc: 'Your shadow wallet lives in Chrome\'s local storage. Uninstall the extension = data gone.' },
            { icon: '📖', title: '100% Open Source', desc: 'Every line of code is on GitHub. Verify our claims yourself. No hidden logic.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text-primary)' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function ArchStep({ number, direction, icon, title, subtitle, desc, tag, tagColor, storage }) {
  const isRight = direction === 'right';
  return (
    <div className="reveal" style={{
      display: 'flex', gap: 32, alignItems: 'flex-start',
      flexDirection: isRight ? 'row' : 'row-reverse',
      padding: '32px 0', borderBottom: '1px solid var(--border)'
    }}>
      {/* Number Circle */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
        background: 'var(--bg-surface)', border: '2px solid var(--border-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', marginTop: 4
      }}>
        <div style={{ fontSize: 24 }}>{icon}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 680 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' 
          }}>STEP {number}</span>
          <span style={{ 
            background: `${tagColor}20`, color: tagColor, border: `1px solid ${tagColor}40`,
            borderRadius: 40, padding: '2px 10px', fontSize: 11, fontWeight: 700
          }}>{tag}</span>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>{title}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {subtitle}
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>{desc}</p>
        <div style={{ 
          background: 'var(--bg-base)', borderRadius: 12, padding: '10px 16px',
          fontSize: 13, color: 'var(--text-secondary)', borderLeft: `3px solid ${tagColor}`,
          fontWeight: 500
        }}>
          💾 {storage}
        </div>
      </div>
    </div>
  );
}
