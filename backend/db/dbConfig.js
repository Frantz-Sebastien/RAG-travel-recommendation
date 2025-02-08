const { Pool } = require('pg');
const pgp = require("pg-promise")()
require("dotenv").config()

// Create a new connection pool
const cn = {
  user: process.env.PG_USER || 'fsmathias',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_NAME || 'travel_recommendation',
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port
};

const db = pgp(cn);

module.exports = db;


// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL Database');
// });

// pool.on('error', (err) => {
//   console.error('❌ Database connection error:', err);
// });

// module.exports = pool;
