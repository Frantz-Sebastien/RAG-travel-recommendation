-- DROP DATABASE IF EXISTS travel_recommendation;
-- CREATE DATABASE travel_recommendation;

-- Switch to the database first
\c travel_recommendation;

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Recreate the users table with the correct columns
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    gender VARCHAR(50),
    income DECIMAL(10, 2),
    education_level VARCHAR(100),
    travel_frequency VARCHAR(50),
    preferred_activities TEXT[],
    vacation_budget DECIMAL(10, 2),
    location VARCHAR(255),
    proximity_to_mountains BOOLEAN,
    proximity_to_beaches BOOLEAN,
    favorite_season VARCHAR(50),
    pets BOOLEAN,
    environmental_concerns BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding the embedding column to store vectors (1536 is for OpenAI)
ALTER TABLE users ADD COLUMN embedding vector(1536);

