import React, { useState, useEffect } from 'react';

// SVGs for the Dashboard
const Icons = {
  Shield: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Flame: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  UserSecret: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22v-2c0-3 2-5 6-5h8c4 0 6 2 6 5v2"/><circle cx="12" cy="8" r="4"/><path d="M3 11l9-9 9 9"/></svg>,
  Activity: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Download: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Settings: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Search: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

async function getExtensionData() {
  return new Promise((resolve) => {
    const requestId = 'dashboard_' + Math.random().toString(36).slice(2);
    const timeout = setTimeout(() => resolve(null), 2000); 

    const handler = (event) => {
      if (event.data?.type === 'SW_GET_STATS_RESPONSE' && event.data?.requestId === requestId) {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        resolve(event.data.payload);
      }
    };
    window.addEventListener('message', handler);
    window.postMessage({ type: 'SW_GET_STATS', requestId }, '*');
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExtensionData().then((data) => {
      if (data) {
        setStats(data);
        setExtensionInstalled(true);
      }
      setLoading(false);
    });
  }, []);

  const handleNewShadow = () => {
    window.postMessage({ type: 'SW_ACTIVATE_SHADOW', requestId: 'dash_new' }, '*');
  };

  const displayStats = {
    shadowWallets: stats?.sessionsCount ?? '0',
    threatsBlocked: stats?.blockedCount ?? '0',
    allowed: stats?.allowedCount ?? '0',
  };

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(214,245,66,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>

        {/* Header Section */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 48, flexWrap: 'wrap', gap: 24,
          animation: 'fadeUp 0.6s ease-out'
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 12, letterSpacing: '-0.03em', fontWeight: 800 }}>Security Center</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: 40, border: '1px solid var(--border)' }}>
              {extensionInstalled ? (
                <>
                  <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>System Active & Shielded</span>
                </>
              ) : (
                <>
                  <span style={{ width: 10, height: 10, background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>System Offline — Install Extension</span>
                </>
              )}
            </div>
          </div>
          
          {extensionInstalled && (
            <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: 15, boxShadow: '0 8px 24px rgba(214,245,66,0.2)' }} onClick={handleNewShadow}>
              <Icons.UserSecret size={18} /> New Shadow Instance
            </button>
          )}
        </div>

        {/* Extension NOT installed banner */}
        {!loading && !extensionInstalled && (
          <div style={{
            background: 'var(--bg-card)', border: '2px solid var(--border-strong)',
            borderRadius: 24, padding: '40px', marginBottom: 48, textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)', animation: 'fadeUp 0.7s ease-out'
          }}>
            <div style={{ display: 'inline-flex', padding: 20, background: 'rgba(0,0,0,0.03)', borderRadius: '50%', marginBottom: 20 }}>
              <Icons.Shield size={48} color="var(--text-muted)" />
            </div>
            <h3 style={{ marginBottom: 12, fontSize: 24, letterSpacing: '-0.02em' }}>Extension Not Detected</h3>
            <p style={{ marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              To view real-time interception analytics, install the ShadowWallet extension. 
              It runs locally in your browser to protect your keys.
            </p>
            <a href="/shadowwallet-extension.zip" download className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 16 }}>
              <Icons.Download size={20} /> Download Extension (Free)
            </a>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, marginBottom: 48, animation: 'fadeUp 0.8s ease-out'
        }}>
          <StatCard
            icon={<Icons.UserSecret size={24} />}
            label="Active Shadow Sessions"
            value={loading ? '...' : displayStats.shadowWallets}
            color="var(--text-primary)"
            desc={extensionInstalled ? "Ephemeral wallets generated" : "Tracking disabled"}
          />
          <StatCard
            icon={<Icons.Shield size={24} />}
            label="Threats Intercepted"
            value={loading ? '...' : displayStats.threatsBlocked}
            color="var(--red)"
            desc={extensionInstalled ? "Blocked by Gemini AI" : "Requires extension"}
          />
          <StatCard
            icon={<Icons.Check size={24} />}
            label="Verified Transactions"
            value={loading ? '...' : displayStats.allowed}
            color="var(--green)"
            desc={extensionInstalled ? "Successfully routed" : "Requires extension"}
          />
        </div>

        {/* Interactive Activity Feed & Gemini AI Graph */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr lg:380px', gap: 24, animation: 'fadeUp 0.9s ease-out' }}>
          
          <div className="card" style={{ padding: 32, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <h3 style={{ fontSize: 20, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.Activity size={20} color="var(--text-muted)" /> Real-Time Activity
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!extensionInstalled ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                  <Icons.Activity size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                  <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--text-primary)' }}>Feed Offline</div>
                  <div style={{ fontSize: 15, marginTop: 8 }}>Install the extension to view intercepted transactions.</div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                  <Icons.Search size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                  <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--text-primary)' }}>Listening for transactions...</div>
                  <div style={{ fontSize: 15, marginTop: 8 }}>Visit a Solana dApp to trigger the AI scanner.</div>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 32, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
             <h3 style={{ fontSize: 20, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.Settings size={20} color="var(--text-muted)" /> AI Risk Engine
             </h3>
             <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
               ShadowWallet uses Google's <strong>Gemini AI</strong> to statically analyze raw transaction bytes before they reach your real wallet, assigning a risk score from 0 to 100.
             </p>
             <div style={{ padding: 24, background: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  <span>Safe</span><span>High Risk</span>
                </div>
                <div style={{ height: 8, background: 'linear-gradient(90deg, var(--green) 0%, var(--amber) 50%, var(--red) 100%)', borderRadius: 4, marginBottom: 16 }} />
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                  Model: Gemini 1.5 Pro
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, desc }) {
  return (
    <div className="card" style={{ padding: 32, border: '1px solid var(--border)', background: 'var(--bg-card)', transition: 'transform 0.3s', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ color: color, background: `${color}15`, padding: 12, borderRadius: 12 }}>
          {icon}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 900, color, marginBottom: 8, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{desc}</div>
    </div>
  );
}
