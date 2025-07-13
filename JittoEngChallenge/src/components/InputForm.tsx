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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div>
        <label>
          Success Rate (0.1–0.9):
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="0.9"
            value={successRate}
            onChange={e => setSuccessRate(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Number of Sequences:
          <input
            type="number"
            min="1"
            value={numSequences}
            onChange={e => setNumSequences(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Optional Seed:
          <input
            type="number"
            value={seed}
            onChange={e => setSeed(e.target.value)}
            placeholder="(optional)"
          />
        </label>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Run Analysis</button>
    </form>
  );
};

export default InputForm; 