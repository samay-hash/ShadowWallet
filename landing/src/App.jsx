import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Architecture from './components/Architecture.jsx';
import InstallGuide from './components/InstallGuide.jsx';
import Stats from './components/Stats.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './components/Dashboard.jsx';

function ExtensionPopup({ onClose }) {
  const handleInstall = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('developers');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(245, 242, 235, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeUp 0.4s ease-out'
    }}>
      <div className="card" style={{ width: 420, maxWidth: '90vw', textAlign: 'center', position: 'relative', padding: 40, border: '2px solid var(--border-strong)' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'transparent',
            border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1
          }}
        >✕</button>
        <div style={{ fontSize: 52, marginBottom: 16 }}>👻</div>
        <h2 style={{ fontSize: 24, marginBottom: 12, letterSpacing: '-0.02em' }}>Add ShadowWallet</h2>
        <p style={{ marginBottom: 28, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Install the Chrome Extension to get full protection.
          It is completely <strong>free</strong> — no Chrome Web Store needed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleInstall}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 16 }}
          >
            📦 Install Extension (Free)
          </button>
          <button onClick={onClose} className="btn btn-outline" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            Continue to Web App
          </button>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          No account required · No payment · Open Source
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Global Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage]);

  const handleGetStarted = () => {
    setCurrentPage('dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showPopup && <ExtensionPopup onClose={() => setShowPopup(false)} />}
      
      <Navbar onGetStarted={handleGetStarted} />
      
      <main style={{ flex: 1 }}>
        {currentPage === 'landing' ? (
          <>
            <Hero onGetStarted={handleGetStarted} />
            <Features />
            <Architecture />
            <InstallGuide />
            <HowItWorks />
            <Stats />
            <CTA onGetStarted={handleGetStarted} />
          </>
        ) : (
          <Dashboard />
        )}
      </main>
      
      {currentPage === 'landing' && <Footer />}
    </div>
  );
}
