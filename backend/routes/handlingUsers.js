import express from 'express';
import db from '../db/dbConfig.js'; // Adjust the path if needed

const router = express.Router();

// 🔍 Find Similar Users
router.post("/find-similar-users", async (req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.status(400).json({ error: "User ID is required" })
    }

    try{
        //Retrieve the embedding for the given user
        const user = await db.one("SELECT embedding FROM users WHERE id = $1", [userId])

        if(!user.embedding){
            return res.status(404).json({ error: "User embedding not found" })
        }

        // Find the top 5 most similar users (excluding the user themselves)
        const similarUsers = await db.any(
            `SELECT id, embedding <=> $1 AS similarity
            FROM users
            WHERE id != $2
            ORDER BY similarity ASC
            LIMIT 5`,
            [user.embedding, userId]
        )

        res.json({ similarUsers })
    } catch(error){
        console.error("Error finding similar users:", error)
        res.status(500).json({ error: error.message })
    }
  })

const handlingUsersRoutes = router; // ✅ Correct export name
export default handlingUsersRoutes;
