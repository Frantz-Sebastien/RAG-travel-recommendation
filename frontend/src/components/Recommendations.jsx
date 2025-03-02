// import { useState, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown" //Import Markdown renderer

// const Recommendations = ({ userId, text }) => {
//     const [recommendations, setRecommendations] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!userId) {
//             console.warn("⚠️ userId is missing, waiting for it to be set...");
//             return;
//         }

//         setLoading(true);

//         const fetchRecommendations = async () => {
//             if (!userId) {
//                 console.error("❌ userId is missing in Recommendations.jsx!");
//                 return;
//             }
//             console.log(`🔍 Fetching recommendations for user ID: ${userId}`); //UPDATE from line 10 to line 14
//             try {
//                 const response = await axios.post("http://localhost:4000/users/get-recommendations", { userId, text });
//                 console.log("📌 Recommendations received:", response.data.recommendations); //UPDATE on this line
//                 setRecommendations(response.data.recommendations);
//             } catch (error) {
//                 console.error("❌ API Request Failed:", error);
//                 console.error("📌 Full Error Response:", error.response?.data || error.message);
//                 setRecommendations([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecommendations();
//     }, [userId]);

//     return (
//         <div>
//             <h2>Recommended Travel Activities</h2>
//             {loading ? (
//                 <p>Loading recommendations...</p>
//             ) : (
//                 Array.isArray(recommendations) ? (
//                     recommendations.map((rec, index) => <p key={index}>{rec}</p>)
//                 ) : (
//                     <ReactMarkdown>{recommendations}</ReactMarkdown> // Directly render the AI-generated text
//                 )
//             )}
//         </div>
//     );
// };

// export default Recommendations;






















import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API_URL =
 /* import.meta.env.MODE === "development" 
    ? */ import.meta.env.VITE_BACKEND_URL
   /* : import.meta.env.VITE_BACKEND_URL_PROD; */

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
            console.log(`🔍 Fetching recommendations for user ID: ${userId}`);
            try {
                const response = await axios.post(`http://localhost:4000/users/get-recommendations`, { userId, text });
                console.log("📌 Recommendations received:", response.data.recommendations);
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
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="h4 mb-0">Recommended Travel Activities</h2>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Generating your travel recommendations...</p>
                                </div>
                            ) : (
                                <div>
                                    {typeof recommendations === 'string' ? (
                                        <ReactMarkdown>
                                            {recommendations}
                                        </ReactMarkdown>
                                    ) : (
                                        Array.isArray(recommendations) && recommendations.map((rec, index) => (
                                            <div key={index} className="mb-3">
                                                {rec}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;

















