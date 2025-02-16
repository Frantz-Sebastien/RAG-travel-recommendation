// require('dotenv').config()
// const express = require('express');
// const cors = require('cors');
// const cn = require("./db/dbConfig");
// const axios = require('axios');

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = process.env.PORT || 4000;

// // ✅ Correct Gemini API URL for embeddings
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedText?key=${GEMINI_API_KEY}`;

// // 🌍 Root route
// app.get('/', (req, res) => {
//     res.send('RAG Travel Recommendation Backend is Running 🚀');
// });

// // 📌 Fetch all users
// app.get('/users', async (req, res) => {
//     try {
//         const users = await cn.any('SELECT * FROM users');
//         res.json(users);
//     } catch (error) {
//         console.error("Error fetching users:", error.message);
//         res.status(500).json({ error: "Failed to retrieve users" });
//     }
// });

// // 📌 Store an embedding manually (if needed)
// app.post('/add-embedding', async (req, res) => {
//     const { user_id, embedding } = req.body;
//     try {
//         if (!Array.isArray(embedding)) {
//             throw new Error("Invalid embedding format");
//         }

//         await cn.none('UPDATE users SET embedding = $1 WHERE id = $2', [embedding, user_id]);
//         res.json({ message: 'Embedding stored successfully' });
//     } catch (error) {
//         console.error("Error storing embedding:", error.message);
//         res.status(500).json({ error: "Failed to store embedding" });
//     }
// });

// // 📌 Generate embeddings using Gemini API
// app.post("/generate-embedding", async (req, res) => {
//     const { user_id } = req.body;

//     if (!user_id) {
//         return res.status(400).json({ error: "user_id is required" });
//     }

//     try {
//         // Step 1: Fetch user's travel preferences
//         const user = await cn.oneOrNone('SELECT preferred_activities FROM users WHERE id = $1', [user_id]);

//         if (!user || !user.preferred_activities) {
//             return res.status(404).json({ error: "No travel preferences found for this user" });
//         }

//         // Step 2: Generate embedding using Gemini API
//         const response = await axios.post(GEMINI_EMBEDDING_URL, {
//             content: {
//                 parts: [{ text: user.preferred_activities }]
//             }
//         });

//         if (!response.data || !response.data.embedding) {
//             throw new Error("Invalid response from Gemini API");
//         }

//         const embedding = response.data.embedding;

//         // Step 3: Store embedding in the database
//         await cn.none("UPDATE users SET embedding = $1 WHERE id = $2", [embedding, user_id]);

//         res.json({ message: "Embedding generated and stored successfully!" });
//     } catch (error) {
//         console.error("Error generating embedding:", error.message);
//         res.status(500).json({ error: "Failed to generate embedding" });
//     }
// });

// // 📌 Get recommendations based on embedding similarity
// app.get('/recommendations/:user_id', async (req, res) => {
//     const { user_id } = req.params;

//     try {
//         // Step 1: Fetch user's embedding
//         const user = await cn.one('SELECT embedding FROM users WHERE id = $1', [user_id]);

//         if (!user.embedding) {
//             return res.status(404).json({ error: "No embedding found for this user" });
//         }

//         // Step 2: Find similar users based on cosine similarity
//         const recommendations = await cn.any(
//             `
//             SELECT id, name, email, 
//                    1 - (embedding <=> $1) AS similarity
//             FROM users
//             WHERE id != $2
//             ORDER BY similarity DESC
//             LIMIT 5;
//             `,
//             [user.embedding, user_id]
//         );

//         res.json(recommendations);
//     } catch (error) {
//         console.error("Error fetching recommendations:", error.message);
//         res.status(500).json({ error: "Failed to get recommendations" });
//     }
// });

// // 🌍 Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from "./db/dbConfig.js"; // Import dbConfig
import { storeEmbedding } from './db/embeddings.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Test Database Connection
app.get("/test-db", async (req, res) => {
    try {
      const result = await db.any("SELECT * FROM users");
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Generate and Store Embedding for a User
  app.post("/generate-embedding", async (req, res) => {
    const { userId, text } = req.body

    if(!userId || !text){
        return res.status(400).json({ error: "User ID and text are required" })
    }

    try {
        await storeEmbedding(userId, text)
        res.json({ message: `Embedding generated and stored for user ID: ${userId}`})
    } catch (error){
        res.status(500).json({ error: error.message })
    }
  })

  app.post('/test', (req, res) => {
    console.log(req.body); // ✅ Now it works!
    res.json({ message: 'Data received!', data: req.body });
  });
  
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

