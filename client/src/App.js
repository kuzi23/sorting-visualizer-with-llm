import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort, insertionSort } from './utils/sortingAlgorithms';
import axios from 'axios';

function App() {
  const [array, setArray] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [lang, setLang] = useState('en');
  const [narration, setNarration] = useState('');
  const [customStep, setCustomStep] = useState('');

  const narrationBoxRef = useRef();
  const stepTimeouts = useRef([]);
  const currentStepIndex = useRef(0);
  const stepsRef = useRef([]);
  const audioRef = useRef(null);

  // ✅ useCallback version to fix ESLint dependency warning
  const generateNewArray = useCallback(() => {
    clearTimeouts();
    stopAudio();
    setIsPaused(false);
    currentStepIndex.current = 0;
    stepsRef.current = [];
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setNarration('');
  }, []);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const clearTimeouts = () => {
    stepTimeouts.current.forEach(clearTimeout);
    stepTimeouts.current = [];
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handleSort = () => {
    clearTimeouts();
    stopAudio();
    setIsPaused(false);
    currentStepIndex.current = 0;

    let steps = [];
    if (selectedAlgorithm === 'bubble') {
      steps = bubbleSort([...array]);
    } else if (selectedAlgorithm === 'insertion') {
      steps = insertionSort([...array]);
    }

    stepsRef.current = steps;

    if (!Array.isArray(steps) || steps.length === 0) {
      console.error('Sorting algorithm returned invalid steps:', steps);
      return;
    }

    animateSorting(steps, 0);
  };

  const animateSorting = (steps, startIndex) => {
    for (let i = startIndex; i < steps.length; i++) {
      const timeout = setTimeout(() => {
        if (!isPaused) {
          if (!Array.isArray(steps[i])) {
            console.error(`Step ${i} is not an array:`, steps[i]);
            clearTimeouts();
            return;
          }
          setArray([...steps[i]]);
          const stepText = `Step ${i + 1}: Updated array.`;
          setNarration(stepText);
          currentStepIndex.current = i + 1;
          narrateStep(stepText);
        }
      }, (i - startIndex) * speed);
      stepTimeouts.current.push(timeout);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    clearTimeouts();
    stopAudio();
  };

  const handleResume = () => {
    if (!isPaused) return;
    setIsPaused(false);
    animateSorting(stepsRef.current, currentStepIndex.current);
  };

  const narrateStep = async (text) => {
    try {
      stopAudio();

      const narrationRes = await axios.post('https://naration-api.onrender.com/narrate', {
        step: text,
        algorithm: selectedAlgorithm,
        difficulty: 'medium',
      });

      const explanation = narrationRes.data.explanation;
      setNarration(explanation);

      const audioRes = await axios.post(
        'https://naration-api.onrender.com/speak',
        { text: explanation },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([audioRes.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Narration error:', error);
    }
  };

  const handleNarration = () => {
    setNarration(`${lang.toUpperCase()}: ${customStep}`);
    narrateStep(customStep);
  };

  const handleExportNarration = () => {
    const blob = new Blob([narration], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'narration.txt';
    link.click();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0 }}>
      <h2 style={{ padding: '20px' }}>Sorting Visualizer with Narration</h2>

      {/* Controls */}
      <div style={{ margin: '0 20px 10px' }}>
        <button onClick={handleSort}>▶️ Play</button>
        <button onClick={handlePause}>⏸️ Pause</button>
        <button onClick={handleResume}>▶️ Resume</button>
        <button onClick={generateNewArray}>🔄 Reset</button>

        <label htmlFor="speedRange" style={{ marginLeft: '10px' }}>Speed:</label>
        <input
          type="range"
          id="speedRange"
          min="10"
          max="1000"
          step="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />

        <button onClick={handleExportNarration} style={{ marginLeft: '10px' }}>📝 Export Narration</button>
      </div>

      {/* Language, Algorithm & Narration Input */}
      <div style={{ margin: '0 20px 20px' }}>
        <label>🌍 Language: </label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          <option value="rw">Kinyarwanda</option>
        </select>

        <label style={{ marginLeft: '20px' }}>🧮 Algorithm: </label>
        <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>

        <br /><br />

        <label htmlFor="stepInput">🧠 Sorting Step:</label>
        <input
          id="stepInput"
          type="text"
          placeholder="e.g., Swapped 8 and 5"
          style={{ width: '300px' }}
          value={customStep}
          onChange={(e) => setCustomStep(e.target.value)}
        />
        <button onClick={handleNarration}>▶️ Narrate</button>
      </div>

      {/* Narration box */}
      <div
        ref={narrationBoxRef}
        style={{ margin: '20px', fontWeight: 'bold', color: 'green' }}
      >
        {narration}
      </div>

      {/* Layout: Bars + Code */}
      <div style={{ display: 'flex', padding: '0 20px' }}>
        {/* Bars */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '300px', borderRight: '1px solid #ccc' }}>
          {array.map((value, index) => (
            <div
              key={index}
              style={{
                margin: '0 2px',
                width: '20px',
                height: `${value * 3}px`,
                backgroundColor: 'teal',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'end',
                fontSize: '10px'
              }}
            >
              {value}
            </div>
          ))}
        </div>

        {/* Code view */}
        <div style={{ flex: 1, background: '#1e1e1e', color: 'white', padding: '20px' }}>
          <h3>Code</h3>
          <pre><code>
{`for (let i = 0; i < arr.length; i++)
  for (let j = 0; j < arr.length - i - 1; j++)
    if (arr[j] > arr[j + 1])
      swap(arr, j, j + 1)`}
          </code></pre>
        </div>
      </div>
    </div>
  );
}

export default App;
