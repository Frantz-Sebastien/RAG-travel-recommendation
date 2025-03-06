import React, { useState, useEffect } from "react";
import "../styles/BackgroundSlider.css"; // Keep your CSS for general styling

const images = [
  "/vacationImages/image1.jpg",
  "/vacationImages/image2.jpg",
  "/vacationImages/image3.jpg",
  "/vacationImages/image4.jpg",
  "/vacationImages/image5.jpg",
  "/vacationImages/image6.jpg",
  "/vacationImages/image7.jpg",
  "/vacationImages/image8.jpg",
  "/vacationImages/image9.jpg",
  "/vacationImages/image10.jpg",
  "/vacationImages/image11.jpg",
  "/vacationImages/image12.jpg",
  "/vacationImages/image13.jpg",
  "/vacationImages/image14.jpg",
  "/vacationImages/image15.jpg",
  "/vacationImages/image16.jpg",
  "/vacationImages/image17.jpg",
  "/vacationImages/image18.jpg",
  "/vacationImages/image19.jpg",
  "/vacationImages/image20.jpg",
  "/vacationImages/image21.jpg",
  "/vacationImages/image22.jpg",
  "/vacationImages/image23.jpg",
  "/vacationImages/image24.jpg",
  "/vacationImages/image25.jpg",
  "/vacationImages/image26.jpg",
  "/vacationImages/image27.jpg",
  "/vacationImages/image28.jpg",
  "/vacationImages/image29.jpg",
  "/vacationImages/image30.jpg",
  "/vacationImages/image31.jpg"
  
];

// Function to shuffle an array (Fisher-Yates Algorithm)
const shuffleArray = (array) => {
  let shuffled = [...array]; // Copy the array to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get a random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

const BackgroundSlider = () => {
  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(images));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("Currently displaying:", shuffledImages[currentIndex]); // Logs each image change

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 < shuffledImages.length) {
          return prevIndex + 1;
        } else {
          // If we reach the end, reshuffle and restart at 0
          setShuffledImages(shuffleArray(images));
          return 0;
        }
      });
    }, 12000); // Change every 12 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, shuffledImages]); // Dependencies

  return (
    <div
      className="background-slider"
      style={{
        backgroundImage: `url(${shuffledImages[currentIndex]})`,
      }}
    ></div>
  );
};

export default BackgroundSlider;
