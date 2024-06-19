const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const windowSize = 10;
let numberWindow = [];

// Map of numberId to their respective third-party API endpoints
const apiEndpoints = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand',
};

app.get('/', (req, res) => {
  res.send('Welcome to the Average Calculator API. Use /numbers/:numberId to fetch numbers.');
});

app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;
  const validIds = ['1', '3', '5', '7'];

  if (!validIds.includes(numberId)) {
    return res.status(400).send('Invalid number ID');
  }

  const thirdPartyApi = apiEndpoints[numberId];

  try {
    const startTime = Date.now();
    const response = await axios.get(thirdPartyApi, { timeout: 500 });
    const elapsed = Date.now() - startTime;

    if (elapsed > 500) throw new Error('Request timeout');

    const fetchedNumbers = response.data.numbers;
    const uniqueNumbers = [...new Set(fetchedNumbers)];
    const windowPrevState = [...numberWindow];

    uniqueNumbers.forEach(num => {
      if (!numberWindow.includes(num)) {
        if (numberWindow.length >= windowSize) {
          numberWindow.shift();
        }
        numberWindow.push(num);
      }
    });

    const windowCurrState = [...numberWindow];
    const avg = windowCurrState.reduce((acc, val) => acc + val, 0) / windowCurrState.length;

    res.json({
      windowPrevState,
      windowCurrState,
      numbers: uniqueNumbers,
      avg: avg.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    res.status(500).send('Error fetching numbers');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});