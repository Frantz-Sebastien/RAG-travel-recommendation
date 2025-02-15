require('dotenv').config({path:"../.env"});
const OpenAI = require("openai")
const db = require("./dbConfig")

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

async function generateEmbedding(text){
    try{
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text
        })
        return response.data[0].embedding
    } catch (error){
        console.error("Error generating embedding:", error.message)
        return null
    }

}

async function updateEmbeddings(){
    try{
        console.log("Fetching users without embeddings...")

        //Fetch users where the embedding is empty/null
        const users = await db.any("SELECT id, preferred_activities FROM users WHERE embedding IS NULL");

        if(users.length === 0){
            console.log("✅ All users already have embeddings!");
            return;
        }
        for (const user of users) {
            console.log(`Generating embeddings for user with id ${user.id}`)
            const embedding = await generateEmbedding(user.id) //Testing
    
            if(embedding){
                await db.none("UPDATE users SET embedding = $1 WHERE id = $2",[embedding, user.id])
                console.log(`Successful embedding for user ${user.id}`)
            }
        }
        console.log("All missing embeddings have been generated.")
    } catch (error){
        console.error("Error updating embeddings:", error.message)
    } finally {
        db.$pool.end(); // Close the database connection properly in pg-promise
    }
}

updateEmbeddings()