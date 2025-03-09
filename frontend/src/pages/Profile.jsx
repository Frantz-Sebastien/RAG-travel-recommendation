import UserProfileForm from "../components/UserProfileForm";
import Recommendations from "../components/Recommendations";
import { useEffect, useState } from "react";
import "../styles/Profile.css"
import axios from "axios";
import { desktopImages, mobileImages} from "../data/images.js"


const API_URL =
    import.meta.env.MODE === "development" 
        ?  import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_URL_PROD; 

const Profile = () => {
    const [userId, setUserId] = useState(null);
    const [embeddingGenerated, setEmbeddingGenerated] = useState(false) //UPDATE
    const [text, setText] = useState("")
    const [backgroundWallpaper, setBackgroundWallpaper] = useState("")

    const handleUserCreated = async (newUserId) => {
        console.log("🚀 handleUserCreated was called with newUserId:", newUserId); // ✅ Debugging log

        // setUserId(newUserId) idk if I need this yet, I might remove this line.

        console.log(`📌 Generating embedding for user ID: ${newUserId}`)

        try {
            await axios.post(`${API_URL}/embeddings/generate-embedding`, {
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

    useEffect(() => {
        const isMobile = window.innerWidth <= 768; //Detects if a mobile phone or not
        const imageArray = isMobile ? mobileImages : desktopImages //Choose the correct array depending on the screen width size
        const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)]; // Pick random image from correct array
        setBackgroundWallpaper(randomImage); //


    }, [])

    return (
        <div className="profile-container">
            <div
                className="profile-background"
                style={{
                    backgroundImage: `url(${backgroundWallpaper})`
                }}
            >
            </div>

                <div className="profile-content" style={{position: "relative", zIndex: 1}}>
                    <h1 className="display-4 text-black text-center" >Personalized Travel Recommender</h1>
                    <UserProfileForm setUserId={setUserId} onEmbeddingGenerated={handleUserCreated} setText={setText}/>
                    {userId && embeddingGenerated ?  <Recommendations userId={userId} text={text} /> : <p className="text-center mt-2">Recommendation will appear down here</p>} 
                </div>
        </div>
    );
};

export default Profile;


