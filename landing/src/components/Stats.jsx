import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 42, label: 'Shadow Wallets Created', suffix: '' },
  { value: 53, label: 'Protected Volume', prefix: '$', suffix: '' },
  { value: 32, label: 'Malicious Txs Blocked', suffix: '' },
  { value: 98.5, label: 'AI Detection Rate', suffix: '%' }
];

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value]);

  const displayValue = Number.isInteger(value) 
    ? Math.floor(count).toLocaleString() 
    : count.toFixed(1);

  return <span ref={nodeRef}>{prefix}{displayValue}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40, textAlign: 'center'
        }}>
          {STATS.map((stat, idx) => (
            <div key={idx} className="reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600,
                color: 'var(--text-primary)', letterSpacing: '-0.03em',
                marginBottom: 8
              }}>
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
