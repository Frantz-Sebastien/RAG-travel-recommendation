import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handlingUsersRoutes from './routes/handlingUsers.js';
import embeddingRoutes from './routes/embeddings.js';
import db from './db/dbConfig.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Test Database Connection
app.get("/test-db", async (req, res) => {
    try {
      const result = await db.any("SELECT * FROM users");
      res.json(result);
    } catch (error) {
      console.error("❌ Database connection error:", error)
      res.status(500).json({ error: error.message });
    }
  });

// Connecting the Routes
app.use("/users", handlingUsersRoutes)
app.use("/embeddings", embeddingRoutes)

//Test Route (For Debugging)
app.post('/test', (req, res) => {
    console.log(req.body); // ✅ Now it works!
    res.json({ message: 'Data received!', data: req.body });
});
  
//Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

