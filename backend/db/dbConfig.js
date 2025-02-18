import pgPromise from "pg-promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pgp = pgPromise();

const cn = {
  user: process.env.PG_USER || "fsmathias",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_NAME || "travel_recommendation",
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port
};

const db = pgp(cn);

export default db;
