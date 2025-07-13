import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

interface Snapshot {
  sequences: number;
  estimate: number;
  input_rate: number;
  difference: number;
}

function App() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [final, setFinal] = useState<Snapshot | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Simulate backend call
  const handleRun = async ({ successRate, numSequences, seed }: { successRate: number; numSequences: number; seed?: number }) => {
    setLoading(true);
    setSnapshots([]);
    setFinal(undefined);
    // Simulate progressive snapshots
    let snaps: Snapshot[] = [];
    for (let i = 1; i <= numSequences; i += Math.max(1, Math.floor(numSequences / 10))) {
      const est = successRate + (Math.random() - 0.5) * 0.05; // fake estimate
      snaps.push({
        sequences: i,
        estimate: est,
        input_rate: successRate,
        difference: est - successRate,
      });
    }
    setSnapshots(snaps);
    setFinal(snaps[snaps.length - 1]);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Are Streaks Real?</h1>
      <InputForm onRun={handleRun} />
      {loading && <div>Running analysis...</div>}
      <ResultsDisplay snapshots={snapshots} final={final} />
    </div>
  );
}

export default App;
