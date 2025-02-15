import dotenv from 'dotenv';

// Load environment variables
dotenv.config(); // Load environment variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store the API key in .env

async function generateEmbedding(text) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/embedding-001:embedText?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.embedding) {
            console.log(`Embedding length: ${data.embedding.length}`);
            return data.embedding; // Return the embedding array
        } else {
            console.error('Error: No embedding returned', data);
            return null;
        }
    } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
    }
}

// // If running directly, test with a sample text
// if (require.main === module) {
//     generateEmbedding("Test text to check embedding size").then(embedding => {
//         if (embedding) console.log(`Embedding vector:`, embedding);
//     });
// }

export default generateEmbedding;
