import { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';
import './App.css';

interface Snapshot {
  sequences: number;
  estimate: number;
  input_rate: number;
  difference: number;
}

interface ExperimentParams {
  successRate: number;
  numSequences: number;
  seed?: number;
  isComparison?: boolean;
}

function App() {
  // Main state
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [final, setFinal] = useState<Snapshot | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Comparison mode state
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<{
    run1: { snapshots: Snapshot[]; final?: Snapshot };
    run2: { snapshots: Snapshot[]; final?: Snapshot };
  } | undefined>(undefined);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  
  // UI state
  const [showTutorial, setShowTutorial] = useState(true);
  const [experimentHistory, setExperimentHistory] = useState<{
    params: ExperimentParams;
    results: { snapshots: Snapshot[]; final?: Snapshot };
    timestamp: Date;
  }[]>([]);

  // Simulate backend call with progressive updates
  const simulateBackendCall = async (params: ExperimentParams): Promise<{ snapshots: Snapshot[]; final: Snapshot }> => {
    const { successRate, numSequences, seed } = params;
    
    // Set seed if provided
    if (seed !== undefined) {
      // In real implementation, this would be passed to the backend
      console.log('Using seed:', seed);
    }

    // Simulate progressive snapshots
    const snapshots: Snapshot[] = [];
    const snapshotInterval = Math.max(1, Math.floor(numSequences / 10));
    
    // Simulate the streak analysis
    let streakTotal = 0;
    let streakSuccess = 0;
    
    for (let seqNum = 1; seqNum <= numSequences; seqNum++) {
      // Simulate 100 binary outcomes for this sequence
      const sequence = Array.from({ length: 100 }, () => 
        Math.random() < successRate ? 1 : 0
      );
      
      // Find non-overlapping 2-success streaks
      for (let i = 0; i < 98; i++) {
        if (sequence[i] === 1 && sequence[i + 1] === 1) {
          if (i + 2 < 100) {
            streakTotal++;
            if (sequence[i + 2] === 1) {
              streakSuccess++;
            }
          }
          i += 2; // Skip overlapping
        }
      }
      
      // Take snapshot at intervals
      if (seqNum % snapshotInterval === 0 || seqNum === numSequences) {
        const estimate = streakTotal > 0 ? streakSuccess / streakTotal : 0;
        snapshots.push({
          sequences: seqNum,
          estimate,
          input_rate: successRate,
          difference: estimate - successRate
        });
      }
    }
    
    return { snapshots, final: snapshots[snapshots.length - 1] };
  };

  // Handle single experiment run
  const handleRun = async (params: ExperimentParams) => {
    setLoading(true);
    setSnapshots([]);
    setFinal(undefined);
    setCurrentStep(0);
    setIsAnimating(false);
    
    try {
      const results = await simulateBackendCall(params);
      setSnapshots(results.snapshots);
      setFinal(results.final);
      
      // Add to history
      setExperimentHistory(prev => [{
        params,
        results,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 experiments
      
    } catch (error) {
      console.error('Experiment failed:', error);
      // In real app, show error message to user
    } finally {
      setLoading(false);
    }
  };

  // Handle comparison run
  const handleCompare = async (params: { run1: any; run2: any }) => {
    setLoading(true);
    setComparisonResults(undefined);
    
    try {
      const [results1, results2] = await Promise.all([
        simulateBackendCall(params.run1),
        simulateBackendCall(params.run2)
      ]);
      
      setComparisonResults({
        run1: results1,
        run2: results2
      });
      
      // Set the first run as the main display
      setSnapshots(results1.snapshots);
      setFinal(results1.final);
      setCurrentStep(0);
      
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export results functionality
  const exportResults = () => {
    if (!final) return;
    
    const data = {
      snapshots,
      final,
      experimentParams: experimentHistory[0]?.params,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streak-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share results functionality
  const shareResults = async () => {
    if (!final) return;
    
    const shareText = `Streak Analysis Results:
Final Estimate: ${final.estimate.toFixed(4)}
Input Rate: ${final.input_rate.toFixed(4)}
Difference: ${final.difference >= 0 ? '+' : ''}${final.difference.toFixed(4)}
Total Sequences: ${final.sequences.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Are Streaks Real? - Analysis Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  // Tutorial component
  const Tutorial = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: 40,
        borderRadius: 16,
        maxWidth: 500,
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: 20 }}>Welcome to "Are Streaks Real?"</h2>
        <p style={{ marginBottom: 16, lineHeight: 1.6 }}>
          This experiment investigates whether consecutive successes actually predict future success.
          Set your parameters and run simulations to see if streaks are real or just statistical illusions.
        </p>
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <h4>Key Features:</h4>
          <ul style={{ lineHeight: 1.8 }}>
            <li>🎯 Adjustable success rates (0.1-0.9)</li>
            <li>📊 Live visualization with multiple chart types</li>
            <li>⚡ Real-time animation controls</li>
            <li>🔬 Side-by-side comparison mode</li>
            <li>⌨️ Keyboard shortcuts (Ctrl+Enter, Ctrl+C, Ctrl+A)</li>
          </ul>
        </div>
        <button 
          onClick={() => setShowTutorial(false)}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      {showTutorial && <Tutorial />}
      
      <Header />
      
      <main style={{ minHeight: '60vh', padding: '40px 0' }}>
        <InputForm 
          onRun={handleRun}
          onCompare={handleCompare}
          isComparisonMode={isComparisonMode}
          onToggleComparisonMode={() => setIsComparisonMode(!isComparisonMode)}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
          isAnimating={isAnimating}
          onToggleAnimation={() => setIsAnimating(!isAnimating)}
        />
        
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            fontSize: '1.2rem',
            color: '#667eea'
          }}>
            <div style={{ marginBottom: 16 }}>🔄 Running Analysis...</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Simulating {experimentHistory[0]?.params.numSequences.toLocaleString() || 0} sequences
            </div>
          </div>
        )}
        
        <ResultsDisplay 
          snapshots={snapshots}
          final={final}
          comparisonResults={comparisonResults}
          isComparisonMode={isComparisonMode}
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
        
        {/* Action buttons */}
        {final && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={exportResults}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              📥 Export Results
            </button>
            <button 
              onClick={shareResults}
              style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              📤 Share Results
            </button>
          </div>
        )}
        
        {/* Experiment History */}
        {experimentHistory.length > 0 && (
          <div style={{
            maxWidth: 800,
            margin: '40px auto',
            padding: '0 20px'
          }}>
            <h3 style={{
              textAlign: 'center',
              marginBottom: 20,
              color: '#2c3e50',
              fontSize: '1.5rem'
            }}>
              Recent Experiments
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 16
            }}>
              {experimentHistory.slice(0, 3).map((exp, i) => (
                <div key={i} style={{
                  background: 'white',
                  padding: 16,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: 8 }}>
                    {exp.timestamp.toLocaleString()}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Success Rate: {exp.params.successRate} | Sequences: {exp.params.numSequences.toLocaleString()}
                  </div>
                  {exp.results.final && (
                    <div style={{ fontSize: '0.9rem', color: '#495057' }}>
                      Final: {exp.results.final.estimate.toFixed(4)} 
                      ({exp.results.final.difference >= 0 ? '+' : ''}{exp.results.final.difference.toFixed(4)})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
