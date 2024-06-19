const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 9876;

app.use(cors());

const windowSize = 10;
let numberWindow = [];


const apiEndpoints = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand',
};

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'average-calculator/build')));

// Root route to provide a welcome message
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'average-calculator/build', 'index.html'));
});

// Route to fetch numbers based on numberId
app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;
  const validIds = ['p', 'f', 'e', 'r'];

  if (!validIds.includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
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
    res.status(500).json({ error: 'Error fetching numbers' });
  }
});

// Catch-all handler to return the React app for any request not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'average-calculator/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});