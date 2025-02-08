require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cn = require("./db/dbConfig")

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('RAG Travel Recommendation Backend is Running 🚀');
});

app.get('/test-db', async (req, res) => {
    try {
      const result = await cn.query('SELECT NOW()'); // Query the database
      console.log('Query Result:', result); // Log the result to debug
      res.json({ message: 'Database connected!', timestamp: result[0].now });
    } catch (err) {
      console.error('DB Error Details:', err.message, err.stack); // Add detailed error logging
      res.status(500).json({ error: 'Database connection failed' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
