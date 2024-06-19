import React, { useState } from 'react';

const AverageCalculator = () => {
  const [numberId, setNumberId] = useState('p'); // Default to prime
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);

  const fetchNumbers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/numbers/${numberId}`);
      const data = await response.json();
      setWindowPrevState(data.windowPrevState);
      setWindowCurrState(data.windowCurrState);
      setNumbers(data.numbers);
      setAvg(data.avg);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <select onChange={(e) => setNumberId(e.target.value)} value={numberId}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchNumbers}>Fetch Numbers</button>
      <div>
        <h2>Previous State</h2>
        <pre>{JSON.stringify(windowPrevState, null, 2)}</pre>
      </div>
      <div>
        <h2>Current State</h2>
        <pre>{JSON.stringify(windowCurrState, null, 2)}</pre>
      </div>
      <div>
        <h2>Numbers from API</h2>
        <pre>{JSON.stringify(numbers, null, 2)}</pre>
      </div>
      <div>
        <h2>Average</h2>
        <pre>{avg}</pre>
      </div>
    </div>
  );
};

export default AverageCalculator;