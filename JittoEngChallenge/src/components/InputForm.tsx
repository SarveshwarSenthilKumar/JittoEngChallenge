import React, { useState, useEffect } from 'react';

interface InputFormProps {
  onRun: (params: { successRate: number; numSequences: number; seed?: number; isComparison?: boolean }) => void;
  onCompare: (params: { run1: any; run2: any }) => void;
  isComparisonMode: boolean;
  onToggleComparisonMode: () => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isAnimating: boolean;
  onToggleAnimation: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ 
  onRun, 
  onCompare, 
  isComparisonMode, 
  onToggleComparisonMode,
  animationSpeed,
  onAnimationSpeedChange,
  isAnimating,
  onToggleAnimation
}) => {
  const [successRate, setSuccessRate] = useState(0.5);
  const [numSequences, setNumSequences] = useState(10000);
  const [seed, setSeed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Comparison mode states
  const [comparisonRun1, setComparisonRun1] = useState({ successRate: 0.3, numSequences: 10000, seed: '' });
  const [comparisonRun2, setComparisonRun2] = useState({ successRate: 0.7, numSequences: 10000, seed: '' });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleSubmit(e as any);
            break;
          case 'c':
            e.preventDefault();
            onToggleComparisonMode();
            break;
          case 'a':
            e.preventDefault();
            onToggleAnimation();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggleComparisonMode, onToggleAnimation]);

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
      isComparison: isComparisonMode
    });
  };

  const handleCompare = () => {
    onCompare({
      run1: { ...comparisonRun1, seed: comparisonRun1.seed ? Number(comparisonRun1.seed) : undefined },
      run2: { ...comparisonRun2, seed: comparisonRun2.seed ? Number(comparisonRun2.seed) : undefined }
    });
  };

  // Shared styles
  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: 20,
    position: 'relative'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 600,
    marginBottom: 8,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  };

  const valueDisplayStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 700,
    backdropFilter: 'blur(10px)'
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: 8,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.2)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: 1
  };

  const toggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    padding: 12,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
      {/* Controls Panel */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Experiment Controls</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={onToggleComparisonMode}
              style={{ ...buttonStyle, width: 'auto', padding: '8px 16px', fontSize: 12 }}
            >
              {isComparisonMode ? 'Single Mode' : 'Compare Mode'}
            </button>
            <button 
              onClick={onToggleAnimation}
              style={{ ...buttonStyle, width: 'auto', padding: '8px 16px', fontSize: 12 }}
            >
              {isAnimating ? 'Stop' : 'Animate'}
            </button>
          </div>
        </div>

        {/* Animation Speed Control */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            Animation Speed
            <span style={valueDisplayStyle}>{animationSpeed}x</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={animationSpeed}
            onChange={e => onAnimationSpeedChange(Number(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            <span>0.1x</span>
            <span>1x</span>
            <span>5x</span>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 16 }}>
          <strong>Shortcuts:</strong> Ctrl+Enter (Run) | Ctrl+C (Compare) | Ctrl+A (Animate)
        </div>
      </div>

      {/* Main Experiment Form */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>
          {isComparisonMode ? 'Run 1 Settings' : 'Experiment Settings'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Success Rate
              <span style={valueDisplayStyle}>{successRate.toFixed(2)}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              <span>0.1</span>
              <span>0.5</span>
              <span>0.9</span>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Number of Sequences
              <span style={valueDisplayStyle}>{numSequences.toLocaleString()}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              <span>100</span>
              <span>50K</span>
              <span>100K</span>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Optional Seed</label>
            <input
              type="number"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              placeholder="Leave empty for random"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 16,
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          {error && <div style={{ color: '#ff6b6b', marginBottom: 16, fontWeight: 600 }}>{error}</div>}
          
          <button type="submit" style={buttonStyle}>
            Run Analysis
          </button>
        </form>
      </div>

      {/* Comparison Mode - Run 2 */}
      {isComparisonMode && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Run 2 Settings</h3>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Success Rate
              <span style={valueDisplayStyle}>{comparisonRun2.successRate.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.01}
              value={comparisonRun2.successRate}
              onChange={e => setComparisonRun2({...comparisonRun2, successRate: Number(e.target.value)})}
              style={sliderStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Number of Sequences
              <span style={valueDisplayStyle}>{comparisonRun2.numSequences.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={comparisonRun2.numSequences}
              onChange={e => setComparisonRun2({...comparisonRun2, numSequences: Number(e.target.value)})}
              style={sliderStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Optional Seed</label>
            <input
              type="number"
              value={comparisonRun2.seed}
              onChange={e => setComparisonRun2({...comparisonRun2, seed: e.target.value})}
              placeholder="Leave empty for random"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 16,
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          <button onClick={handleCompare} style={buttonStyle}>
            Run Comparison
          </button>
        </div>
      )}
    </div>
  );
};

export default InputForm; 