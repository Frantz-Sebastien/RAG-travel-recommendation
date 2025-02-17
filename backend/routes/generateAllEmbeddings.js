import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 4000
const API_URL = `http://localhost:${PORT}/embeddings/generate-embeddings-for-all`

//This function was created to automate the process of adding embeddings to every single users in the database. When the backend is working, this function should be used at least once and afterwards, sparingly.

async function generateAllEmbeddings() {
    let keepGoing = true;

    while (keepGoing) {
        const response = await fetch(API_URL, { method: "POST" });
        const data = await response.json();

        console.log(data.message);

        if (data.message.includes("All users already have embeddings!")) {
            keepGoing = false;
            console.log("✅ Embedding generation completed!");
        }
    }
}

generateAllEmbeddings();