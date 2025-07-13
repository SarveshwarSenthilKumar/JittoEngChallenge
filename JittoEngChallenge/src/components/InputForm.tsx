import React, { useState } from 'react';

interface InputFormProps {
  onRun: (params: { successRate: number; numSequences: number; seed?: number }) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onRun }) => {
  const [successRate, setSuccessRate] = useState(0.5);
  const [numSequences, setNumSequences] = useState(10000);
  const [seed, setSeed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (successRate < 0.1 || successRate > 0.9) {
      setError('Success rate must be between 0.1 and 0.9');
      return;
    }
    if (numSequences < 1) {
      setError('Number of sequences must be at least 1');
      return;
    }
    setError(null);
    onRun({
      successRate,
      numSequences,
      seed: seed ? Number(seed) : undefined,
    });
  };

  // Slider styling (can be moved to CSS file)
  const sliderStyle: React.CSSProperties = {
    width: '100%',
    margin: '0.5rem 0',
    accentColor: '#646cff',
    height: 36,
    background: 'transparent',
    display: 'block',
  };

  // Input and label styling for consistency
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 500,
    marginBottom: 8,
    color: '#222',
  };
  const valueStyle: React.CSSProperties = {
    color: '#646cff',
    fontWeight: 700,
  };
  const inputBoxStyle: React.CSSProperties = {
    width: '100%',
    height: 36,
    padding: '0 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
    color: '#222',
    background: '#fff',
    boxSizing: 'border-box',
    margin: 0,
    display: 'block',
  };
  const formBoxStyle: React.CSSProperties = {
    marginBottom: '2rem',
    maxWidth: 400,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px #0001',
    padding: 24,
    color: '#222',
  };
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: 0,
    borderRadius: 8,
    background: '#646cff',
    color: '#fff',
    fontWeight: 600,
    fontSize: 18,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 1px 4px #0001',
    marginTop: 8,
    marginBottom: 0,
    display: 'block',
  };

  return (
    <form onSubmit={handleSubmit} style={formBoxStyle}>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>
          Success Rate: <span style={valueStyle}>{successRate.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.01}
          value={successRate}
          onChange={e => setSuccessRate(Number(e.target.value))}
          style={sliderStyle}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
          <span>0.1</span>
          <span>0.5</span>
          <span>0.9</span>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>
          Number of Sequences: <span style={valueStyle}>{numSequences}</span>
        </label>
        <input
          type="range"
          min={100}
          max={100000}
          step={100}
          value={numSequences}
          onChange={e => setNumSequences(Number(e.target.value))}
          style={sliderStyle}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
          <span>100</span>
          <span>50,000</span>
          <span>100,000</span>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>
          Optional Seed:
        </label>
        <input
          type="number"
          value={seed}
          onChange={e => setSeed(e.target.value)}
          placeholder="(optional)"
          style={inputBoxStyle}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <button type="submit" style={buttonStyle}>
        Run Analysis
      </button>
    </form>
  );
};

export default InputForm; 