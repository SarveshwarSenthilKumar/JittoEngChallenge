import React from 'react';

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 700,
    margin: '0 0 16px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 400,
    margin: '0 0 24px 0',
    opacity: 0.9,
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6
  };

  const featureListStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    flexWrap: 'wrap',
    marginTop: 32
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.9rem',
    opacity: 0.8,
    background: 'rgba(255,255,255,0.1)',
    padding: '8px 16px',
    borderRadius: 20,
    backdropFilter: 'blur(10px)'
  };

  const decorationStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none'
  };

  return (
    <header style={headerStyle}>
      <div style={decorationStyle}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={titleStyle}>Are Streaks Real?</h1>
        <p style={subtitleStyle}>
          Investigate whether success streaks actually predict future success. 
          Run simulations with different success rates and discover if two wins in a row 
          truly increase your chances of a third victory.
        </p>
        
        <div style={featureListStyle}>
          <div style={featureItemStyle}>
            <span>🎯</span>
            <span>Binary Outcomes</span>
          </div>
          <div style={featureItemStyle}>
            <span>📊</span>
            <span>Live Visualization</span>
          </div>
          <div style={featureItemStyle}>
            <span>⚡</span>
            <span>Real-time Analysis</span>
          </div>
          <div style={featureItemStyle}>
            <span>🔬</span>
            <span>Scientific Method</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 