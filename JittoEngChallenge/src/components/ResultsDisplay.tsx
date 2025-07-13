import React from 'react';

interface Snapshot {
  sequences: number;
  estimate: number;
  input_rate: number;
  difference: number;
}

interface ResultsDisplayProps {
  snapshots: Snapshot[];
  final?: Snapshot;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ snapshots, final }) => {
  // Prepare data for SVG line graph
  const width = 400;
  const height = 200;
  const padding = 40;
  const maxSequences = Math.max(...snapshots.map(s => s.sequences), 1000);
  const minEstimate = Math.min(...snapshots.map(s => s.estimate), 0.0);
  const maxEstimate = Math.max(...snapshots.map(s => s.estimate), 1.0);

  const points = snapshots.map(s => {
    const x = padding + ((s.sequences / maxSequences) * (width - 2 * padding));
    const y = height - padding - ((s.estimate - minEstimate) / (maxEstimate - minEstimate || 1)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <h2>Results</h2>
      <svg width={width} height={height} style={{ background: '#f4f4f4', marginBottom: '1rem' }}>
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" />
        {/* Line graph */}
        {snapshots.length > 1 && (
          <polyline
            fill="none"
            stroke="#646cff"
            strokeWidth="2"
            points={points}
          />
        )}
        {/* Dots */}
        {snapshots.map((s, i) => {
          const x = padding + ((s.sequences / maxSequences) * (width - 2 * padding));
          const y = height - padding - ((s.estimate - minEstimate) / (maxEstimate - minEstimate || 1)) * (height - 2 * padding);
          return <circle key={i} cx={x} cy={y} r={3} fill="#213547" />;
        })}
      </svg>
      {final && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Final Estimate:</strong> {final.estimate.toFixed(3)}<br />
          <strong>Input Rate:</strong> {final.input_rate.toFixed(3)}<br />
          <strong>Difference:</strong> {final.difference >= 0 ? '+' : ''}{final.difference.toFixed(3)}
        </div>
      )}
      <div>
        <h3>Snapshots</h3>
        <ul style={{ maxHeight: 120, overflowY: 'auto', textAlign: 'left' }}>
          {snapshots.map((s, i) => (
            <li key={i}>
              <strong>{s.sequences} seq:</strong> est={s.estimate.toFixed(3)}, diff={s.difference >= 0 ? '+' : ''}{s.difference.toFixed(3)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay; 