DROP DATABASE IF EXISTS travel_recommendation;
CREATE DATABASE travel_recommendation;

-- Switch to the database first
\c travel_recommendation;

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding the embedding column to store vectors (1536 is for OpenAI)
ALTER TABLE users ADD COLUMN embedding vector(1536);


-- Preferences Table
CREATE TABLE preferences (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  preference VARCHAR(50),
  rating INT
);

-- Recommendations Table
CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  recommendation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
