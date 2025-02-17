import 'dotenv/config';
import express from 'express'
import axios from 'axios';
import db from '../db/dbConfig.js'; // Import database connection

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

const router = express.Router(); // Create Express Router


/**
 * Generates embeddings using Gemini API
 * @param {string} text - Input text to convert into embeddings
 * @returns {Promise<Array>} - Embedding vector
 * However... I don't know how I will make this work for my website yet... but I'm leaving it because it can be a great feature, I just need to know how to implement it for the frontend.
 */
export async function generateEmbedding(text) {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            content: { parts: [{ text }] }
        });

        if (response.data && response.data.embedding && response.data.embedding.values) {
            return response.data.embedding.values; // 768-dimensional vector
        } else {
            throw new Error("Invalid response from Gemini API");
        }
    } catch (error) {
        console.error("Error generating embedding:", error.response?.data || error.message);
        return null;
    }
}

/**
 * Stores user embedding in the database
 * @param {number} userId - ID of the user
 * @param {string} text - Input text to convert and store
 */
export async function storeEmbedding(userId, text) {
    const embedding = await generateEmbedding(text);
    if (!embedding){
        console.error(`❌ Failed to generate embedding for user ${userId}`)
        return;
    }

    try {
        await db.none("UPDATE users SET embedding = $1 WHERE id = $2", [embedding, userId]);
        console.log(`✅ Embedding stored for user ID: ${userId}`);
    } catch (error) {
        console.error("❌ Error storing embedding:", error);
    }
}


router.post("/generate-embedding", async (req, res) => {
    const { userId, text } = req.body;
    
    if (!userId || !text) {
        return res.status(400).json({ error: "User ID and text are required" });
    }
    
    try {
        await storeEmbedding(userId, text);
        res.json({ message: `Embedding generated and stored for user ID: ${userId}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate Embeddings for All Users (in Batches)
router.post("/generate-embeddings-for-all", async (req, res) => {
    try {
        const batchSize = 100; // Adjust batch size
        const users = await db.any("SELECT id FROM users WHERE embedding IS NULL LIMIT $1", [batchSize]);

        if (users.length === 0) {
            return res.json({ message: "All users already have embeddings!" });
        }

        for (const user of users) {
            await storeEmbedding(user.id, `User ${user.id}'s travel preferences`);
        }

        res.json({ message: `Generated embeddings for ${users.length} users. Run again for the next batch.` });
    } catch (error) {
        console.error("Error generating embeddings:", error);
        res.status(500).json({ error: error.message });
    }
})

const embeddingRoutes = router; // ✅ Correct export name
export default embeddingRoutes;




