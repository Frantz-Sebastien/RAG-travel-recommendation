require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("./dbConfig");

// ../../frontend
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate embeddings using Gemini
async function generateEmbedding(text) {
    try {
        const model = gemini.getGenerativeModel({ model: "embedding-001" });
        const response = await model.embedContent({ content: text });
        
        return response.embedding; // Extract the embedding vector
    } catch (error) {
        console.error("Error generating embedding:", error.response ? error.response.data : error.message, error.stack);
        return null;
    }
}

// Function to update embeddings for users without them
async function updateEmbeddings() {
    try {
        console.log("Fetching users without embeddings...");

        // Fetch users whose embedding column is NULL
        const users = await db.any("SELECT id, preferred_activities FROM users WHERE embedding IS NULL");

        if (users.length === 0) {
            console.log("✅ All users already have embeddings!");
            return;
        }

        for (const user of users) {
            console.log(`🔹 Generating embedding for user ${user.id}: ${user.preferred_activities}`);
            
            const embedding = await generateEmbedding(user.preferred_activities);

            if (embedding) {
                await db.none("UPDATE users SET embedding = $1 WHERE id = $2", [embedding, user.id]);
                console.log(`✅ Successfully stored embedding for user ${user.id}`);
            }
        }

        console.log("🚀 All missing embeddings have been generated!");
    } catch (error) {
        console.error("❌ Error updating embeddings:", error.message);
    } finally {
        db.$pool.end(); // Close the database connection properly in pg-promise
    }
}

// Run the function
updateEmbeddings();
