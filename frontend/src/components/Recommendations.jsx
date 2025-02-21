import { useState, useEffect } from "react";
import axios from "axios";

const Recommendations = ({ userId, text }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            console.warn("⚠️ userId is missing, waiting for it to be set...");
            return;
        }

        setLoading(true);

        const fetchRecommendations = async () => {
            if (!userId) {
                console.error("❌ userId is missing in Recommendations.jsx!");
                return;
            }
            console.log(`🔍 Fetching recommendations for user ID: ${userId}`); //UPDATE from line 10 to line 14
            try {
                const response = await axios.post("http://localhost:4000/users/get-recommendations", { userId, text });
                console.log("📌 Recommendations received:", response.data.recommendations); //UPDATE on this line
                setRecommendations(response.data.recommendations);
            } catch (error) {
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
            {loading ? (
                <p>Loading recommendations...</p>
            ) : (
                Array.isArray(recommendations) ? (
                    recommendations.map((rec, index) => <p key={index}>{rec}</p>)
                ) : (
                    <p>{recommendations}</p> // Directly render the AI-generated text
                )
            )}
        </div>
    );
};

export default Recommendations;

