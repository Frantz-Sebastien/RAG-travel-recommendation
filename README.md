# Travel Recommender - RAG-Based Travel Recommendation Engine

## Overview
This project is a **Retrieval-Augmented Generation (RAG) system** designed to provide **personalized travel recommendations**. The system leverages **vector embeddings** to match users with similar travel preferences and generate travel suggestions using AI.

It utilizes **PostgreSQL with pgvector** to store and compare embeddings, and **Google's Gemini API** to generate user embeddings.

---

## Tech Stack
- **Frontend**: ReactJS (with Vite)
- **Backend**: Express.js
- **Database**: PostgreSQL + pgvector for embeddings
- **AI Embeddings**: Gemini API (formerly OpenAI API but Gemini API is easier to work with)
- **Package Manager**: npm

---

## Project Structure

```
backend/
│── db/
│   ├── schema.sql  # Database schema
│   ├── seed.sql  # Initial database seed data
│   ├── updateDatabase.sql # To update database and track SQL commands from VS Code (optional)
│   ├── 
│── routes/
│   ├── embeddings.js  # Handles embedding generation and storage
│   ├── generateAllEmbeddings.js  # Automates embeddings for all users
│   ├── handlingUsers.js  # Finds similar users & travel recommendations
│── server.js  # Main backend server
│── .env  # Environment variables
frontend/ # React frontend (to be implemented)
```

---

## Features

### User Embedding Generation
- Users' travel preferences are converted into **vector embeddings** using **Google Gemini API**.
- These embeddings are stored in **PostgreSQL with pgvector**.

### Finding Similar Users
- A **vector similarity search** identifies users with similar travel preferences.
- This is used to recommend **activities, destinations, and budgets**.

### Personalized Travel Recommendations
- Based on users with **similar embeddings**, the system suggests **top travel preferences**.
- It ranks travel activities **based on popularity**.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/travel-recommendation.git
cd travel-recommendation
```

### 2️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 3️⃣ Set Up PostgreSQL Database
- Install **PostgreSQL** and enable the **pgvector** extension.
- Create a database named `travel_recommendation`.

### 4️⃣ Configure `.env` File
Create a `.env` file in the `backend/` directory:
```ini
PORT=4000
PG_USER=your_postgres_username
PG_HOST=localhost
PG_NAME=travel_recommendation
PG_PORT=5432
GEMINI_API_KEY=your_google_gemini_api_key
```

### 5️⃣ Run Database Migrations
```bash
psql -U your_postgres_username -d travel_recommendation -f db/schema.sql
```

### 6️⃣ Start the Server
```bash
npm start
```
_Server should run at `http://localhost:4000`._

---

## API Endpoints

### 🎭 Generate Embeddings for a User
**POST** `/embeddings/generate-embedding`
```json
{
  "userId": 1,
  "text": "User 1's travel preferences"
}
```
Stores an embedding for the given user.

### Generate All Missing Embeddings
**POST** `/embeddings/generate-embeddings-for-all`
- Generates embeddings for **all users who don’t have one yet**.

### Find Similar Users
**POST** `/users/find-similar-users`
```json
{
  "userId": 1
}
```
🛩️ Returns the **top 5 users** with the most similar embeddings.

### Get Personalized Travel Recommendations
**POST** `/users/get-recommendations`
```json
{
  "userId": 1
}
```
Returns **top travel recommendations** based on similar users' preferences.

---

## Future Enhancements
- **Frontend UI** to allow users to input preferences.
- **More AI-powered recommendations**.
- **User authentication & profiles**.

---

## License
This project is open-source. Feel free to contribute!
```


