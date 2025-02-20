import { useState, useEffect } from "react";
import axios from "axios";

const PingTest = () => {
    const [message, setMessage] = useState("No response yet...");

    useEffect(() => {
        axios.get("http://localhost:4000/users/ping")
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
