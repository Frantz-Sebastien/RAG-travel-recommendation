import { useEffect, useState } from "react";
import { desktopImages, mobileImages} from "../data/images.js"
import "../styles/About.css"

const About = () => {
    const [backgroundWallpaper, setBackgroundWallpaper] = useState("")

useEffect(() => {
    const isMobile = window.innerWidth <= 768; //Detects if a mobile phone or not
    const imageArray = isMobile ? mobileImages : desktopImages //Choose the correct array depending on the screen width size
    const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)]; // Pick random image from correct array
        setBackgroundWallpaper(randomImage); //


    }, [])

return (
    <div className="container mt-5 p-5">
        <div
            className="profile-background d-flex"
            style={{
                backgroundImage: `url(${backgroundWallpaper})`,
                backgroundPosition: "center",
                // minHeight: "100vh",
                backgroundSize: "cover"
            }}
            >
        </div>
      <div className="content-overlay p-4">
        <h1 className="mb-4">About the Travel Recommender</h1>
        
        <p>
            Welcome to the <strong>RAG-Based Travel Recommendation Engine</strong> —
            a smart travel assistant that helps you find your next ideal vacation spot
            based on your unique preferences!
        </p>

        <h3 className="mt-4">💡 Why I Built This</h3>
        <p>
            Planning the perfect trip isn’t easy. There are so many destinations, preferences,
            and budgets to consider. I wanted to create something that could understand a
            person’s travel style and recommend places they’ll actually love.
        </p>
        <p>
            Inspired by tools like <strong>Airbnb</strong>, <strong>Booking.com</strong>, and
            <strong> Expedia</strong>, this app uses real user data and AI to suggest personalized
            travel options — just like the big players do!
        </p>

        <h3 className="mt-4">⚙️ What It Does (Features)</h3>
        <ul>
            <li><strong>🧠 Personalized Trip Suggestions:</strong> Based on your answers, the system finds others like you and recommends destinations.</li>
            <li><strong>🏝️ Smart Matching:</strong> Uses vector similarity and a RAG model to compare your profile to over 35,000 others in the dataset.</li>
            <li><strong>🧳 Context-Aware Results:</strong> Understands your travel style to generate realistic suggestions.</li>
        </ul>

        <h3 className="mt-4">🧰 Built With</h3>
        <ul>
            <li><strong>ReactJS</strong> – frontend interface</li>
            <li><strong>ExpressJS</strong> – backend API</li>
            <li><strong>PostgreSQL + pgvector</strong> – database with embeddings</li>
            <li><strong>Gemini API</strong> – generates smart recommendations</li>
            <li>
            <strong>Dataset:</strong>{" "}
            <a href="https://www.kaggle.com/datasets/jahnavipaliwal/mountains-vs-beaches-preference" target="_blank" rel="noreferrer">
                Mountains vs Beaches Preference Dataset
            </a>
            </li>
        </ul>

        <h3 className="mt-4">👨‍💻 A Learning Project</h3>
        <p>
            This isn’t just an app — it’s a learning journey. I built this to understand how
            RAG systems work in the real world, combining AI with real user data to make useful recommendations.
        </p>
        <p>
            If you have questions or feedback, feel free to reach out through the <a href="/contact">Contact</a> page!
        </p>

    </div>      
    </div>
  );
};

export default About;
