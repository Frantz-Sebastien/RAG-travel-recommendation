import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API_URL =
    import.meta.env.MODE === "development" 
        ?  import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_URL_PROD; 

const Recommendations = ({ userId, text }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    //useState for the Location Images Feature
    const [locationData, setLocationData] = useState("")
    const [imageUrls, setImagesUrls] = useState([])
    const [loadingImages, setLoadingImages] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

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
                const response = await axios.post(`${API_URL}/users/get-recommendations`, { userId, text });
                const { recommendations, locationData } = response.data

                console.log("📌 Recommendations received:", recommendations);
                console.log("📌 Location Data received:", locationData)
                setRecommendations(recommendations);
                setLocationData(locationData)
            } catch (error) {
                console.error("❌ API Request Failed:", error);
                console.error("📌 Full Error Response:", error.response?.data || error.message);
                setRecommendations([]);
                // setLocationData("") do I need to put this?
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    //Add a useEffect for rendering the images after the recommendation has been rendered
    useEffect(() => {
        if(locationData){
            const fetchImagesForLocation = async () => {
                setLoadingImages(true)
                try{
                    const imgResponse = await axios.get(`${API_URL}/images/location-images`, {
                        params: { locationName: locationData}
                    })
                    setImagesUrls(imgResponse.data.images || [])
                } catch (error){
                    console.error("❌ Error fetching images:", error)
                } finally {
                    setLoadingImages(false)
                }
            }
            fetchImagesForLocation()
        }
    }, [locationData])

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

                            <div>
                                {loadingImages && <p>Loading images...</p>}
                                {imageUrls.length > 0 && (
                                    <div className="mt-4">
                                        <h5>Explore the Beauty of {locationData}</h5>
                                        <div className="d-flex flex-wrap justify-content-center gap-3">
                                            {imageUrls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`location preview of ${locationData} ${idx + 1}`}
                                                    onClick={() => setSelectedImage(url)}
                                                    style={{ width: "300px", height: "200px", borderRadius: "8px", objectFit: "cover", cursor: "pointer", transition: "transform 0.2s"}}             
                                                />
                                            ))}
                                        </div> 
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
                {/* Working on the Modal down here */}
                <div>
                    {selectedImage && (
                        <div
                            className="modal-overlay"
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                backgroundColor: "rgba (0, 0, 0, 0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 9999
                            }}
                        >
                        <div
                            style={{
                                background: "#fff",
                                padding: "10px",
                                borderRadius: "8px",
                                maxWidth: "90%",
                                maxHeight: "80%",
                                boxShadow: "0 0 10px rgba(0,0,0,0.5"
                            }}
                            onClick={(event) => event.stopPropagation()}
                        >
                        <img
                            src={selectedImage} 
                            alt="expanded view"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "70vh",
                                borderRadius: "6px",
                                objectFit: "contain"
                            }}
                        />
                        <div className="text-center mt-2">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="btn btn-sm btn-secondary"
                            >
                                close
                            </button>

                        </div>

                        </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;

















