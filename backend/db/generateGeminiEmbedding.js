import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store the API key in .env

console.log("GEMINI_API_KEY from env file:", process.env.GEMINI_API_KEY);

async function generateEmbedding(text) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedText?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.embedding) {
            throw new Error("Error: No embedding returned from Gemini API");
        }

        console.log(`Embedding length: ${data.embedding.length}`);
        return data.embedding;
    } catch (error) {
        console.error("Error generating embedding:", error.message);
        return null;
    }
}


// If running directly, test with a sample text
if (import.meta.url === `file://${process.argv[1]}`) {
    generateEmbedding("Test text to check embedding size").then(embedding => {
        if (embedding) console.log(`Embedding vector:`, embedding);
    });
}

export default generateEmbedding;
