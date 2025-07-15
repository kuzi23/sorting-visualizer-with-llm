import React, { useState, useEffect, useRef } from 'react';
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
  const currentStepIndex = useRef(0); // Track current step index for pause/resume
  const stepsRef = useRef([]); // Store steps for replay on resume

  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = () => {
    clearTimeouts();
    setIsPaused(false);
    currentStepIndex.current = 0;
    stepsRef.current = [];
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setNarration('');
  };

  const clearTimeouts = () => {
    stepTimeouts.current.forEach(clearTimeout);
    stepTimeouts.current = [];
  };

  const handleSort = () => {
    clearTimeouts();
    setIsPaused(false);
    currentStepIndex.current = 0;

    let steps = [];
    if (selectedAlgorithm === 'bubble') {
      steps = bubbleSort([...array]);
    } else if (selectedAlgorithm === 'insertion') {
      steps = insertionSort([...array]);
    }

    stepsRef.current = steps;
    animateSorting(steps, 0);
  };

  const animateSorting = (steps, startIndex) => {
    for (let i = startIndex; i < steps.length; i++) {
      const timeout = setTimeout(() => {
        if (!isPaused) {
          setArray([...steps[i]]);
          const stepText = `Step ${i + 1}: Updated array.`;
          setNarration(stepText);
          currentStepIndex.current = i + 1;
          narrateStep(stepText); // ← Narrate each step
        }
      }, (i - startIndex) * speed);
      stepTimeouts.current.push(timeout);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    clearTimeouts();
  };

  const handleResume = () => {
    if (!isPaused) return;
    setIsPaused(false);
    animateSorting(stepsRef.current, currentStepIndex.current);
  };

  const narrateStep = async (text) => {
    try {
      // 1. Get explanation
      const narrationRes = await axios.post('https://naration-api.onrender.com/narrate', {
        step: text,
        algorithm: selectedAlgorithm,
        difficulty: 'medium', // or add a difficulty state if needed
      });

      const explanation = narrationRes.data.explanation;
      setNarration(explanation);

      // 2. Get audio
      const audioRes = await axios.post(
        'https://naration-api.onrender.com/speak',
        { text: explanation },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([audioRes.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Narration error:', error);
    }
  };

  const handleNarration = () => {
    setNarration(`${lang.toUpperCase()}: ${customStep}`);
    narrateStep(customStep); // ← Add this
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

      {/* Language and narration */}
      <div style={{ margin: '0 20px 20px' }}>
        <label>🌍 Language: </label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          <option value="rw">Kinyarwanda</option>
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

function App() {
  const [array, setArray] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
  };

  const handleSort = () => {
    let steps = [];

    if (selectedAlgorithm === 'bubble') {
      steps = bubbleSort([...array]);
    } else if (selectedAlgorithm === 'insertion') {
      steps = insertionSort([...array]);
    }

    animateSorting(steps);
  };

  const animateSorting = (steps) => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        setArray([...step]);
      }, index * 300);
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sorting Visualizer</h1>
      <button onClick={generateNewArray}>Generate New Array</button>
      <select
        onChange={(e) => setSelectedAlgorithm(e.target.value)}
        value={selectedAlgorithm}
        style={{ marginLeft: '10px' }}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="insertion">Insertion Sort</option>
      </select>
      <button onClick={handleSort} style={{ marginLeft: '10px' }}>Sort</button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end', height: '300px', marginTop: '20px' }}>
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
      <p>New array generated.</p>
    </div>
  );
}

export default App;
