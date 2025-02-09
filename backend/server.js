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

// app.get('/test-db', async (req, res) => {
//     try {
//       const result = await cn.one('SELECT NOW()'); // Query the database
//       console.log('Query Result:', result); // Log the result to debug
//       res.json({ message: 'Database connected!', timestamp: result.now });
//     } catch (err) {
//       console.error('DB Error Details:', err.message, err.stack); // Add detailed error logging
//       res.status(500).json({ error: 'Database connection failed' });
//     }
//   });

app.get('/users', async (req, res) => {
    try {
        const users = await cn.any('SELECT * FROM users'); // Adjust table name
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

app.post('/add-embedding', async (req, res) => {
    const { user_id, embedding } = req.body;
    try {
        // Ensure embedding is an array and user_id is valid
        if(!Array.isArray(embedding) || embedding.length !== 1536){
            throw new Error("Invalid embedding format or size")
        }

        await cn.none('UPDATE users SET embedding = $1 WHERE id = $2', [embedding, user_id])
        res.json({message: 'Embedding stored successfully'})
    } catch (error){
        console.error("Error storing embedding:", error.message)
        res.status(500).json({ error: "Failed to store embedding" })
    }
})

app.get('/recommendations/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        // Fetch the embedding for the given user_id
        const user = await cn.one('SELECT embedding FROM users WHERE id = $1', [user_id]);

        // If no embedding exists, return an error
        if (!user.embedding) {
            return res.status(404).json({ error: "No embedding found for this user" });
        }

        // Find the most similar users based on cosine similarity
        const recommendations = await cn.any(
            `
            SELECT id, name, email, 
                   1 - (embedding <=> $1) AS similarity
            FROM users
            WHERE id != $2
            ORDER BY similarity DESC
            LIMIT 5;
            `,
            [user.embedding, user_id]
        );

        res.json(recommendations);
    } catch (error) {
        console.error("Error fetching recommendations:", error.message);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
});

  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
