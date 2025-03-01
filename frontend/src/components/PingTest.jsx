import { useState, useEffect } from "react";
import axios from "axios";


const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;



const PingTest = () => {
    const [message, setMessage] = useState("No response yet...");

    useEffect(() => {
        axios.get(`${API_URL}/users/ping`)
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error("❌ Error fetching /ping:", error);
                setMessage("Error fetching data.");
            });
    }, []);

    return (
        <div>
            <h2>Ping Test</h2>
            <p>{message}</p>
        </div>
    );
};

export default PingTest;
