import UserProfileForm from "../components/UserProfileForm";
import Recommendations from "../components/Recommendations";
import { useState } from "react";
import axios from "axios";

//Line 14 was updated

const Profile = () => {
    const [userId, setUserId] = useState(null);
    const [embeddingGenerated, setEmbeddingGenerated] = useState(false) //UPDATE
    const [text, setText] = useState("")

    const handleUserCreated = async (newUserId) => {
        console.log("🚀 handleUserCreated was called with newUserId:", newUserId); // ✅ Debugging log

        // setUserId(newUserId) idk if I need this yet, I might remove this line.

        console.log(`📌 Generating embedding for user ID: ${newUserId}`)

        try {
            await axios.post("http://localhost:4000/embeddings/generate-embedding", {
                userId: newUserId,
                text: `User ${newUserId}'s travel preferences`
            });

            console.log("✅ Embedding successfully generated!");
            setEmbeddingGenerated(true); // ✅ Mark embedding as ready
        } catch (error) {
            console.error("❌ Error generating embedding:", error.response?.data || error.message);
        }
    }

    console.log("🔍 Current userId in Profile.jsx:", userId); // ✅ Debugging Log

    return (
        <div>
            <h1>User Profile</h1>
            <UserProfileForm setUserId={setUserId} onEmbeddingGenerated={handleUserCreated} setText={setText}/>
            {userId && embeddingGenerated ?  <Recommendations userId={userId} text={text} /> : <p>Submit the form to get recommendations.</p>} 
        </div>
    );
};

export default Profile;


