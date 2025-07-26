import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    marginTop: '60px'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 40,
    textAlign: 'left'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: 20
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: 12,
    color: '#ecf0f1'
  };

  const linkStyle: React.CSSProperties = {
    color: '#bdc3c7',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 8,
    transition: 'color 0.3s ease',
    fontSize: '0.9rem'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#bdc3c7',
    marginBottom: 16
  };

  const techStackStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  };

  const techTagStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: '0.8rem',
    color: '#ecf0f1'
  };

  const bottomStyle: React.CSSProperties = {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: 40,
    paddingTop: 20,
    fontSize: '0.8rem',
    color: '#95a5a6'
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>About the Project</h3>
          <p style={descriptionStyle}>
            This is a full-stack web application that investigates the concept of "streaks" 
            in binary outcomes. It simulates thousands of sequences to determine if 
            consecutive successes actually predict future success.
          </p>
          <div style={techStackStyle}>
            <span style={techTagStyle}>React</span>
            <span style={techTagStyle}>TypeScript</span>
            <span style={techTagStyle}>AWS Lambda</span>
            <span style={techTagStyle}>Python</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={titleStyle}>Quick Links</h3>
          <a href="#experiment" style={linkStyle}>Run Experiment</a>
          <a href="#results" style={linkStyle}>View Results</a>
          <a href="#comparison" style={linkStyle}>Compare Runs</a>
          <a href="#documentation" style={linkStyle}>Documentation</a>
        </div>

        <div style={sectionStyle}>
          <h3 style={titleStyle}>Resources</h3>
          <a href="https://github.com/yourusername/jitto-eng-challenge" style={linkStyle}>
            📁 GitHub Repository
          </a>
          <a href="#api-docs" style={linkStyle}>
            🔌 API Documentation
          </a>
          <a href="#deployment" style={linkStyle}>
            🚀 Deployment Guide
          </a>
          <a href="#costs" style={linkStyle}>
            💰 Cost Analysis
          </a>
        </div>

        <div style={sectionStyle}>
          <h3 style={titleStyle}>Discussion Questions</h3>
          <p style={descriptionStyle}>
            • What did you expect before running the experiment?<br/>
            • Did the results meet your expectations?<br/>
            • How do different success rates affect outcomes?<br/>
            • Can people misinterpret streaks in real life?
          </p>
        </div>
      </div>

      <div style={bottomStyle}>
        <p>
          Built for the Jitto Full Stack Engineering Challenge (J250) | 
          Investigating the reality of success streaks through data science and simulation
        </p>
      </div>
    </footer>
  );
};

export default Footer; 