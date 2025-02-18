import axios from "axios";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Loaded API Key:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Not Loaded");


const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent"; // Replace with actual endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Make sure it's set in .env

// Function to generate embedding
async function generateEmbedding(text) {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            content: { parts: [{ text }] }
        });

        if (response.data && response.data.embedding && response.data.embedding.values) {
            console.log("Generated Embedding:", response.data.embedding.values);
            return response.data.embedding.values; // 768-dimensional vector
        } else {
            throw new Error("Invalid response from Gemini API");
        }
    } catch (error) {
        console.error("Error generating embedding:", error.response?.data || error.message);
        return null;
    }
}

// 🔥 Test the function
async function test() {
    const sampleText = "I love traveling to tropical beaches and relaxing by the ocean.";
    console.log("Testing with text:", sampleText);
    
    const embedding = await generateEmbedding(sampleText);
    
    if (embedding) {
        console.log("✅ Embedding Generated Successfully!");
    } else {
        console.log("❌ Embedding Generation Failed.");
    }
}

test();
