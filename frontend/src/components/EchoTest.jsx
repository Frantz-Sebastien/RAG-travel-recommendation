import { useState } from "react";
import axios from "axios";

const EchoTest = () => {
    const [inputText, setInputText] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/users/echo", { message: inputText });
            setResponseMessage(response.data.response);
        } catch (error) {
            console.error("❌ Error submitting data:", error);
            setResponseMessage("Error sending request.");
        }
    };

    return (
        <div>
            <h2>Echo Test</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Type something..." 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)} 
                />
                <button type="submit">Send</button>
            </form>
            <p>Response: {responseMessage}</p>
        </div>
    );
};

export default EchoTest;
