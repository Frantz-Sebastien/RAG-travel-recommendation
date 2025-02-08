const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'fsmathias',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_recommendation',
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

module.exports = pool;
