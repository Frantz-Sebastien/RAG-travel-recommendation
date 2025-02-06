require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('RAG Travel Recommendation Backend is Running 🚀');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
