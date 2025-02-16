import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();

const cn = {
  user: process.env.PG_USER || "fsmathias",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_NAME || "travel_recommendation",
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port
};

const db = pgp(cn);

export default db;
