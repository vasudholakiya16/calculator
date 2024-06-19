// src/AverageCalculator.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AverageCalculator = () => {
  const [numberId, setNumberId] = useState('p'); 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/numbers/${numberId}`);
      setData(response.data);
    } catch (error) {
      setError('Error fetching numbers');
    }
  };

  useEffect(() => {
    fetchData();
  }, [numberId]);

  return (
    <div>
      <h1>Average Calculator</h1>
      <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchData}>Fetch Numbers</button>
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>Results</h2>
          <p>Previous State: {JSON.stringify(data.windowPrevState)}</p>
          <p>Current State: {JSON.stringify(data.windowCurrState)}</p>
          <p>Numbers: {JSON.stringify(data.numbers)}</p>
          <p>Average: {data.avg}</p>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator;