import React, { useState, useEffect, useRef } from 'react';

interface Snapshot {
  sequences: number;
  estimate: number;
  input_rate: number;
  difference: number;
}

interface ResultsDisplayProps {
  snapshots: Snapshot[];
  final?: Snapshot;
  comparisonResults?: { run1: { snapshots: Snapshot[]; final?: Snapshot }; run2: { snapshots: Snapshot[]; final?: Snapshot } };
  isComparisonMode: boolean;
  isAnimating: boolean;
  animationSpeed: number;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  snapshots, 
  final, 
  comparisonResults,
  isComparisonMode,
  isAnimating,
  animationSpeed,
  currentStep,
  onStepChange
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation effect
  useEffect(() => {
    if (isAnimating && snapshots.length > 0) {
      const interval = setInterval(() => {
        onStepChange(Math.min(currentStep + 1, snapshots.length - 1));
      }, 1000 / animationSpeed);
      return () => clearInterval(interval);
    }
  }, [isAnimating, currentStep, snapshots.length, animationSpeed, onStepChange]);

  // Canvas drawing for advanced charts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || snapshots.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw data
    const maxSequences = Math.max(...snapshots.map(s => s.sequences));
    const minEstimate = Math.min(...snapshots.map(s => s.estimate), 0);
    const maxEstimate = Math.max(...snapshots.map(s => s.estimate), 1);

    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    snapshots.slice(0, currentStep + 1).forEach((s, i) => {
      const x = padding + (s.sequences / maxSequences) * (width - 2 * padding);
      const y = height - padding - ((s.estimate - minEstimate) / (maxEstimate - minEstimate || 1)) * (height - 2 * padding);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    snapshots.slice(0, currentStep + 1).forEach((s, i) => {
      const x = padding + (s.sequences / maxSequences) * (width - 2 * padding);
      const y = height - padding - ((s.estimate - minEstimate) / (maxEstimate - minEstimate || 1)) * (height - 2 * padding);
      
      ctx.fillStyle = i === currentStep ? '#ff6b6b' : '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [snapshots, currentStep, chartType]);

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

  const statCardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    margin: '8px 0',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    cursor: 'pointer',
    margin: '0 4px',
    fontSize: 14,
    fontWeight: 600,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  };

  const renderComparisonChart = () => {
    if (!comparisonResults) return null;

    const width = 600;
    const height = 300;
    const padding = 40;

    return (
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Side-by-Side Comparison</h3>
        <svg width={width} height={height} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 4}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 4}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* Run 1 line */}
          {comparisonResults.run1.snapshots.length > 1 && (
            <polyline
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="3"
              points={comparisonResults.run1.snapshots.map(s => {
                const x = padding + (s.sequences / 100000) * (width - 2 * padding);
                const y = height - padding - s.estimate * (height - 2 * padding);
                return `${x},${y}`;
              }).join(' ')}
            />
          )}
          
          {/* Run 2 line */}
          {comparisonResults.run2.snapshots.length > 1 && (
            <polyline
              fill="none"
              stroke="#4ecdc4"
              strokeWidth="3"
              points={comparisonResults.run2.snapshots.map(s => {
                const x = padding + (s.sequences / 100000) * (width - 2 * padding);
                const y = height - padding - s.estimate * (height - 2 * padding);
                return `${x},${y}`;
              }).join(' ')}
            />
          )}
          
          {/* Legend */}
          <rect x={width - 120} y={20} width="100" height="60" fill="rgba(0,0,0,0.3)" rx="8"/>
          <circle cx={width - 100} cy={35} r="4" fill="#ff6b6b"/>
          <text x={width - 90} y={40} fill="white" fontSize="12">Run 1</text>
          <circle cx={width - 100} cy={55} r="4" fill="#4ecdc4"/>
          <text x={width - 90} y={60} fill="white" fontSize="12">Run 2</text>
        </svg>
      </div>
    );
  };

  const renderStats = () => {
    if (!final) return null;

    const stats = [
      { label: 'Final Estimate', value: final.estimate.toFixed(4), color: '#ff6b6b' },
      { label: 'Input Rate', value: final.input_rate.toFixed(4), color: '#4ecdc4' },
      { label: 'Difference', value: `${final.difference >= 0 ? '+' : ''}${final.difference.toFixed(4)}`, color: final.difference >= 0 ? '#51cf66' : '#ff6b6b' },
      { label: 'Total Sequences', value: final.sequences.toLocaleString(), color: '#667eea' }
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map((stat, i) => (
          <div key={i} style={statCardStyle}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderSnapshotsList = () => (
    <div style={{ maxHeight: 200, overflowY: 'auto', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 16 }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Progressive Results</h4>
      {snapshots.slice(0, currentStep + 1).map((s, i) => (
        <div 
          key={i} 
          style={{ 
            padding: '8px 12px', 
            margin: '4px 0', 
            background: i === currentStep ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
            borderRadius: 6,
            fontSize: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span><strong>{s.sequences.toLocaleString()}</strong> sequences</span>
          <span style={{ color: s.difference >= 0 ? '#51cf66' : '#ff6b6b' }}>
            {s.estimate.toFixed(4)} ({s.difference >= 0 ? '+' : ''}{s.difference.toFixed(4)})
          </span>
        </div>
      ))}
    </div>
  );

  if (snapshots.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
          Run an analysis to see results here
        </h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      {/* Chart Controls */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Results Visualization</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => setChartType('line')}
              style={{ ...buttonStyle, background: chartType === 'line' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }}
            >
              Line
            </button>
            <button 
              onClick={() => setChartType('bar')}
              style={{ ...buttonStyle, background: chartType === 'bar' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }}
            >
              Bar
            </button>
            <button 
              onClick={() => setChartType('area')}
              style={{ ...buttonStyle, background: chartType === 'area' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }}
            >
              Area
            </button>
          </div>
        </div>

        {/* Animation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button 
            onClick={() => onStepChange(0)}
            style={buttonStyle}
            disabled={currentStep === 0}
          >
            ⏮️ Start
          </button>
          <button 
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            style={buttonStyle}
            disabled={currentStep === 0}
          >
            ⏪ Previous
          </button>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Step {currentStep + 1} of {snapshots.length}
          </span>
          <button 
            onClick={() => onStepChange(Math.min(snapshots.length - 1, currentStep + 1))}
            style={buttonStyle}
            disabled={currentStep === snapshots.length - 1}
          >
            ⏩ Next
          </button>
          <button 
            onClick={() => onStepChange(snapshots.length - 1)}
            style={buttonStyle}
            disabled={currentStep === snapshots.length - 1}
          >
            ⏭️ End
          </button>
        </div>

        {/* Main Chart */}
        <canvas 
          ref={canvasRef}
          width={600}
          height={300}
          style={{ width: '100%', maxWidth: 600, height: 300, borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Statistics */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Final Statistics</h3>
        {renderStats()}
      </div>

      {/* Comparison Chart */}
      {isComparisonMode && comparisonResults && renderComparisonChart()}

      {/* Snapshots List */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Progressive Results</h3>
        {renderSnapshotsList()}
      </div>
    </div>
  );
};

export default ResultsDisplay; 