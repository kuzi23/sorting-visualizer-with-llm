import React, { useState, useEffect } from 'react';
import { bubbleSort, insertionSort } from './utils/sortingAlgorithms';

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
