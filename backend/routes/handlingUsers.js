import express from 'express';
import db from '../db/dbConfig.js'; // Adjust the path if needed
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const router = express.Router();
router.use(express.json()); // ✅ Ensure body parsing

//Function for separating LOCATION from AI response
function userFriendlyAIResponseAndLocationSeparator(responseTextFromAI){
    const locationRegex = /LOCATION:\s*(.+)/i; //I'm not familiar with using Regex, but it is helpful to locate specific and case sensitive characters
    const match = responseTextFromAI.match(locationRegex)
    console.log(match) //for Debugging

    const locationData = match ? match[1].trim() : null;
    console.log(locationData) //for Debugging
    const userFriendlyAIResponse = responseTextFromAI.replace(locationRegex, '').trim() 
    console.log(userFriendlyAIResponse) //for Debugging

    return { userFriendlyAIResponse, locationData }

}

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
      console.log("📌 Received request at /get-recommendations"); //For debugging purposes only
      console.log("Request body:", req.body); //For debugging purposes only
      const { userId, text, vacation_budget } = req.body; //Deconstructing req.body (req.body is an object)
  
      //Checking if the user ID is present
      if (!userId || isNaN(userId)) {
          return res.status(400).json({ error: "User ID is required" });
      }
  
      try {
          //Step 1: Retrieve the user's embedding
          const user = await db.oneOrNone("SELECT embedding FROM users WHERE id = $1", [userId]);
  
          //Checking to see if an user exist with the userId provided
          if (!user) {
              return res.status(404).json({ error: "User not found" });
          }
  
          //Checking if the embedding is empty or null for specific user
          if (!user.embedding) {
              return res.status(404).json({ error: "User embedding not found bro!" });
          }
  
          //Step 2: Find similar users based on embeddings
          const similarUsers = await db.any(
              `SELECT id, embedding <=> $1 AS similarity
              FROM users
              WHERE id != $2
                AND (embedding <=> $1) < 0.4
              ORDER BY similarity ASC
              LIMIT 10`,
              [user.embedding, userId]
          );
  
          if (similarUsers.length === 0) {
              return res.json({ recommendations: [], message: "No similar users found" });
          }
  
          //Step 3: Get travel preferences of similar users
          const similarUserIds = similarUsers.map(user => user.id); //creating new array of IDs of user with similar taste
          const preferences = await db.any(
              `SELECT preferred_activities, vacation_budget, favorite_season, income, age, gender, location
              FROM users
              WHERE id IN ($1:csv)`,
              [similarUserIds.length ? similarUserIds : [-1]]
          );
  
          //Step 4: Generate recommendations based on common preferences
          const activityCounts = {};
  
          // Updated lists to store user attributes
          const budgetList = [];
          const seasonList = [];
          const locationList = [];
          const incomeList = [];
          const ageList = [];
          const genderList = [];
  
          preferences.forEach(pref => {
              let activities;
  
              if (typeof pref.preferred_activities === "string") {
                  try {
                      //If it's a string, attempt to parse it as JSON
                      activities = JSON.parse(pref.preferred_activities);
                      if (!Array.isArray(activities)) activities = [activities];
                  } catch (error) {
                      activities = []; //If parsing fails, default to an empty array
                  }
              } else if (Array.isArray(pref.preferred_activities)) {
                  //If it's already an array, leave it alone, keep it as is (although, I'm not sure that it will ever be an array...🤔)
                  activities = pref.preferred_activities;
              } else {
                  //If it's not a string or an array (like null, undefined, boolean, number, etc...)
                  activities = [];
              }
  
              activities.forEach(activity => {
                  activityCounts[activity] = (activityCounts[activity] || 0) + 1;
              });
  
              //Store other relevant preferences like vacation_budget, favorite_season, income, age, gender, location
              budgetList.push(pref.vacation_budget);
              seasonList.push(pref.favorite_season);
              locationList.push(pref.location);
              ageList.push(pref.age);
              genderList.push(pref.gender);
              incomeList.push(pref.income);
          });
  
          //Helper function to count occurrences of elements in an array
          const countOccurrences = (arr) => {
              return arr.reduce((acc, val) => {
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
              }, {});
          };
  
          //Helper function to find the most common in an array
          const mostCommon = (arr) => {
              const counts = countOccurrences(arr);
              return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]; //Sort in descending order and return the top item
          };
  
          // Finding the most common preference values
          const topActivity = mostCommon(Object.entries(activityCounts).map(([key]) => key)); // ✅ Fixed activity selection
          const topBudget = mostCommon(budgetList);
          const topSeason = mostCommon(seasonList);
          const topLocation = mostCommon(locationList);
          const topIncome = mostCommon(incomeList);
          const topAge = mostCommon(ageList);
          const topGender = mostCommon(genderList);
  
          //Step 5: Generate AI response using Gemini API
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" }); // ✅ Removed extra space in model name
  
          const prompt = `
          A user is looking for a personalized travel recommendation. Here's some information about other similar users:

          -Favorite Activities: ${topActivity}
          -Preferred Travel Season: ${topSeason}
          -Vacation Budget: ${topBudget} (IMPORTANT: The user can spend up to $${vacation_budget})
          -Current Location: ${topLocation}
          -Average Income: ${topIncome}
          -Age Group: ${topAge}
          -Gender Identity: ${topGender}

          

          ###Generate Their Perfect Trip:
          Considering all this information and the user's Own Input: ${text}, provide a **detailed and engaging** travel recommendation, **making sure the total cost stays close to $${vacation_budget}.**
          - Suggest a **specific destination** that aligns with their preferences **and is within their budget.**
          - Describe **why** this destination suits them (activity, climate, budget-friendly spots) **providing specific examples of how costs will be managed.**
          - Recommend **at least 3 key experiences** they should try. **including estimated costs for each.**
          - If budget is low, suggest **affordable travel options**.
          - If they enjoy socializing, suggest **group-friendly** ideas. If they are lone traveler, suggest **solo-travel-friendly** ideas.

          Make the response sound **friendly, engaging, and expert-like.** The recommendation should feel like it was a carefully thought out **just for them**.

          **IMPORTANT**:  
            At the end of your response, add a ONE line in this exact format (with no extra text or punctuation):

            LOCATION: <the destination name>

            Only include that ONE line in the format "LOCATION: destination" and ensure everything else is purely your engaging recommendation text. 
          `;
  
          const result = await model.generateContent(prompt);
          const aiResponse = await result.response.text(); // ✅ Ensuring proper response handling
          const { userFriendlyAIResponse, locationData } = userFriendlyAIResponseAndLocationSeparator(aiResponse) //Implementing the function here
  
        //   res.json({ recommendations: aiResponse }); We do not need this line right now..., I have it so that the user is deleted after the recommendation. I will remove this feature once I figure out how to have the users register to the Website.

        // Step 6: Delete the user after generating the recommendation
        await db.none("DELETE FROM users WHERE id = $1", [userId]);

        res.json({ 
            recommendations: userFriendlyAIResponse,
            locationData, //parsed location value ready to be used for the Image Search API
            message: "User deleted after recommendation" 
        });
  
      } catch (error) {
          console.error("❌ Error generating recommendations:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
  

const handlingUsersRoutes = router; // ✅ Correct export name

console.log("✅ handlingUsers.js - Loaded Routes:", router.stack.map(r => r.route?.path).filter(Boolean));

export default handlingUsersRoutes;




