import 'dotenv/config';
import axios from 'axios';
import db from './dbConfig.js'; // Import database connection

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

/**
 * Generates embeddings using Gemini API
 * @param {string} text - Input text to convert into embeddings
 * @returns {Promise<Array>} - Embedding vector
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
    if (!embedding) return;

    try {
        await db.none("UPDATE users SET embedding = $1 WHERE id = $2", [embedding, userId]);
        console.log(`✅ Embedding stored for user ID: ${userId}`);
    } catch (error) {
        console.error("Error storing embedding:", error);
    }
}


