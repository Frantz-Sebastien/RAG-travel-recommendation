import { useState, useEffect } from "react";
import axios from "axios";

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            console.warn("⚠️ userId is missing, waiting for it to be set...");
            return;
        }

        setLoading(true)

        const fetchRecommendations = async () => {
            if(!userId){
                console.error("❌ userId is missing in Recommendations.jsx!")
                return
            }
            console.log(`🔍 Fetching recommendations for user ID: ${userId}`) //UDATE from line 10 to line 14
            try {
                const response = await axios.post("http://localhost:4000/users/get-recommendations", { userId, "Content-Type": "application/json" });
                console.log("📌 Recommendations received:", response.data.recommendations); //UPDATE on this line
                setRecommendations(response.data.recommendations);
            } catch (error) {
                // console.error("❌ Error fetching recommendations:", error);
                // console.error("❌ Error fetching recommendations:", error.response?.data || error.message); //UPDATE
                console.error("❌ API Request Failed:", error);
                console.error("📌 Full Error Response:", error.response?.data || error.message);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    return (
        <div>
            <h2>Recommended Travel Activities</h2>
            {loading ? <p>Loading recommendations...</p> : (
                <ul>
                    {recommendations.length > 0 ? (
                        recommendations.map((rec, index) => <li key={index}>{rec}</li>)
                    ) : (
                        <p>No recommendations available</p>
                    )}
                </ul>
            )}
        </div>
  
    );
};

export default Recommendations;
