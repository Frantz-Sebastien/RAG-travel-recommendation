\c travel_recommendation;

-- -- Drop unnecessary tables
-- DROP TABLE IF EXISTS preferences CASCADE;
-- DROP TABLE IF EXISTS recommendations CASCADE;

-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'users';

--Updating the embedding column to store vectors (768 for GeminiAI)
-- ALTER TABLE users
--     ALTER COLUMN embedding TYPE vector(768);

CREATE INDEX users_embedding_idx ON users USING ivfflat (embedding vector_cosine_ops);
