import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handlingUsersRoutes from './routes/handlingUsers.js';
import embeddingRoutes from './routes/embeddings.js';
import locationImagesRoutes from './routes/locationImages.js'
import db from './db/dbConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';

//Ensure dotenv loads from the correct path
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, ".env") });

dotenv.config()

console.log("✅ .env Loaded Successfully");

const app = express();
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Test Database Connection
app.get("/test-db", async (req, res) => {
    try {
      const result = await db.any("SELECT * FROM users LIMIT 10");
      res.json(result);
    } catch (error) {
      console.error("❌ Database connection error:", error)
      res.status(500).json({ error: error.message });
    }
  });

  console.log("✅ Registering /users routes...");


// Connecting the Routes (Commenting these out for now to avoid duplicate)
// app.use("/users", handlingUsersRoutes)
// app.use("/embeddings", embeddingRoutes)
// app.use("/images", locationImagesRoutes)

//Test Route (For Debugging)
app.post('/test', (req, res) => {
    console.log(req.body); // ✅ Now it works!
    res.json({ message: 'Data received!', data: req.body });
});
  

// console.log("✅ Registered Routes:");
// console.log(app._router.stack.filter(r => r.route).map(r => r.route.path));



// ✅ Register `/users` Routes
console.log("📌 Registering /users routes...");
app.use("/users", handlingUsersRoutes);
console.log("✅ Successfully registered /users routes!");

// ✅ Register `/embeddings` Routes
console.log("📌 Registering /embeddings routes...");
app.use("/embeddings", embeddingRoutes);
console.log("✅ Successfully registered /embeddings routes!");

// ✅ Register `/images` Routes
console.log("📌 Registering /embeddings routes...");
app.use("/images", locationImagesRoutes);
console.log("✅ Successfully registered /images routes!");

// Debug: Log All Registered Routes
setTimeout(() => {
    console.log("🔍 FULL ROUTE LIST:");

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // This is a normal route
            console.log(`➡️  ${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === "router") {
            // This is a router middleware (like /users, /embeddings)
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    console.log(`➡️  ${Object.keys(handler.route.methods).join(", ").toUpperCase()} ${middleware.regexp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "")}${handler.route.path}`);
                }
            });
        }
    });

    console.log("✅ Route debugging complete.");
}, 2000);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});



//Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
