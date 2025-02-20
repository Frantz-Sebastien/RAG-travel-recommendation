import express from 'express';
import db from '../db/dbConfig.js'; // Adjust the path if needed

const router = express.Router();
router.use(express.json()); // ✅ Ensure body parsing

//Small Test
router.get("/ping", (req, res) => {
    console.log("📌 Received request at /users/ping");
    res.json({ message: "✅ Backend is working!" });
});

//Testing Response-Request flow
router.post("/echo", (req, res) => {
    console.log("📌 Received request at /users/echo with data:", req.body);
    
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required!" });
    }

    res.json({ response: `You sent: ${message}` });
});



//Creating new user
router.post("/create", async (req, res) => {
    console.log("Incoming Request Data:", req.body); // 👈 Add this for debugging
    const {
        age, gender, income, education_level, travel_frequency,
        preferred_activities, vacation_budget, location,
        proximity_to_mountains, proximity_to_beaches,
        favorite_season, pets, environmental_concerns, preference
    } = req.body;

    if (!age || !gender || !income || !education_level || !travel_frequency ||
        !preferred_activities || !vacation_budget || !location || !favorite_season) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await db.one(
            `INSERT INTO users (age, gender, income, education_level, travel_frequency, preferred_activities, 
                               vacation_budget, location, proximity_to_mountains, proximity_to_beaches, 
                               favorite_season, pets, environmental_concerns, preference)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING id`,
            [
                age, gender, income, education_level, travel_frequency, preferred_activities,
                vacation_budget, location, proximity_to_mountains, proximity_to_beaches,
                favorite_season, pets, environmental_concerns, preference
            ]
        );

        res.status(201).json({ message: "User profile created", userId: result.id });
    } catch (error) {
        console.error("❌ Error creating user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 🔍 Find Similar Users
router.post("/find-similar-users", async (req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.status(400).json({ error: "User ID is required" })
    }

    try{
        //Retrieve the embedding for the given user
        const user = await db.oneOrNone("SELECT embedding FROM users WHERE id = $1", [userId])

        if(!user){
            return res.status(404).json({ error: "User not found" })
        }

        if(!user.embedding){
            return res.status(404).json({ error: "User embedding not found" })
        }

        console.log(`🔍 Searching for users similar to user ID: ${userId}`);

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

  router.post("/get-recommendations", async (req, res) => {
    console.log("📌 Received request at /get-recommendations"); //UPDATE
    console.log("Request body:", req.body); //UPDATE
    const { userId } = req.body //Deconstructing req.body (req.body is an object)

    //Checking if the user ID is present
    if(!userId){
        return res.status(400).json({ error: "User ID is required" })
    }

    try{
        //Step 1: Retrieve the user's embedding
        const user = await db.oneOrNone("SELECT embedding FROM users WHERE id = $1", [userId])

        //Checking to see if an user exist with the userId provided
        if(!user){
            return res.status(404).json({ error: "User not found" })
        }

        //Checking if the embedding is empty or null for specific user
        if(!user.embedding){
            return res.status(404).json({ error: "User embedding not found bro!"})
        }

        //Step 2: Find similar users based on embeddings
        const similarUsers = await db.any(
            `SELECT id, embedding <=> $1 AS similarity
            FROM users
            WHERE id != $2
            ORDER BY similarity ASC
            LIMIT 5`,
            [user.embedding, userId]
        )

        if(similarUsers.length === 0){
            return res.json({ recommendations: [], message: "No similar users found" })
        }

        //Step 3: Get travel preferences of similar users
        const similarUserIds = similarUsers.map(user => user.id) //creating new array of IDs of user with similar taste
        const preferences = await db.any(
            `SELECT preferred_activities, vacation_budget, favorite_season
            FROM users
            WHERE id IN ($1:csv)`,
            [similarUserIds.length ? similarUserIds : [-1]]
        )

        //Step 4: Generate recommendations based on common preferences
        const activityCounts = {};
        preferences.forEach(pref => {
            let activities;

            if(typeof pref.preferred_activities === "string"){
                //If it's a string, wrap it in an array
                activities = [pref.preferred_activities]
            } else if(Array.isArray(pref.preferred_activities)){
                //If it's already an array, leave it alone, keep it as is (although, I'm not sure that it will ever be an array...🤔)
                activities = pref.preferred_activities
            } else{
                //If it's not a string or an array (like null, undefined, boolean, number, etc...)
                activities = []
            }

            activities.forEach(activity => {
                activityCounts[activity] = (activityCounts[activity] || 0) + 1;
            });
        });


        //Step 5: Rank recommendations by popularity
        const rankedActivities = Object.entries(activityCounts)
            .sort((a,b) => b[1] - a[1])
            .map(entry => entry[0])

        res.json({ recommendations: rankedActivities.slice(0,5) })
    }   catch(error){
            console.error("❌ Error generating recommendations:", error)
            res.status(500).json({ error: "Internal Server Error" })
    }
  })

const handlingUsersRoutes = router; // ✅ Correct export name

console.log("✅ handlingUsers.js - Loaded Routes:", router.stack.map(r => r.route?.path).filter(Boolean));

export default handlingUsersRoutes;




