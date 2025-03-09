import React, { useState, useEffect } from "react";
import "../styles/BackgroundSlider.css"; // Keep your CSS for general styling
import { desktopImages, mobileImages} from "../data/images.js"

// Function to return a shuffled array (using Fisher-Yates Algorithm)
const shuffleArray = (array) => {
  let shuffled = [...array]; // Copy the array to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get a random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

const BackgroundSlider = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); //
  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(isMobile ? mobileImages : desktopImages));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      if(mobile !== isMobile){
        setIsMobile(mobile)
        setShuffledImages(shuffleArray(mobile ? mobileImages : desktopImages));
        setCurrentIndex(0)
      }
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobile])

  // Preload the next image
  useEffect(() => {
    if (shuffledImages.length === 0) return; // Safeguard
    const nextIndex = (currentIndex + 1) % shuffledImages.length;
    const img = new Image();
    img.src = shuffledImages[nextIndex];

    //Ensure the image is fully loaded before transitioning
    img.load = () => {
      console.log("Next image preloaded: ", shuffledImages[nextIndex])
      setTimeout(() => setCurrentIndex(nextIndex), 200)
    }


  }, [currentIndex, shuffledImages]);
  
  // Set up the interval for changing images
  useEffect(() => {
    if(shuffledImages.length === 0) return;
    
    console.log("Currently displaying:", shuffledImages[currentIndex]); // Logs each image change

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 < shuffledImages.length) {
          return prevIndex + 1;
        } else {
          // If we reach the end, reshuffle and restart at 0
          setShuffledImages(shuffleArray(isMobile ? mobileImages : desktopImages));
          return 0;
        }
      });
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, shuffledImages, isMobile]); // Dependencies

  return (
    <div className="background-wrapper">
      {/* Old Image (Fades out) */}
      <div
        key={currentIndex} // Forces React to re-render when the image changes
        className="background-slider fade-out"
        style={{
          backgroundImage: `url(${shuffledImages[(currentIndex - 1 + shuffledImages.length) % shuffledImages.length]})`,
        }}
      ></div>
  
      {/* New Image (Fades in) */}
      <div
        key={currentIndex + "-new"} // Ensures a unique key to trigger React updates
        className="background-slider fade-in"
        style={{
          backgroundImage: `url(${shuffledImages[currentIndex]})`,
        }}
      ></div>
    </div>
  );
  
};

export default BackgroundSlider;
