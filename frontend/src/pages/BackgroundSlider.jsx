import React, { useState, useEffect } from "react";
import "../styles/BackgroundSlider.css"; // Keep your CSS for general styling

const images = [
  "/vacationImages/pexels-alexmoliski-28969898.jpg",//
  "/vacationImages/pexels-andre-furtado-43594-2916817.jpg",//
  "/vacationImages/pexels-vome-3800412.jpg", //
  "/vacationImages/pexels-andrew-harvard-1340985-4846144.jpg",//
  "/vacationImages/pexels-andrew-harvard-1340985-11311701.jpg",//
  "/vacationImages/pexels-asadphoto-457882.jpg",//
  "/vacationImages/pexels-asadphoto-1024989.jpg",//
  "/vacationImages/pexels-asadphoto-1268855.jpg",//
  "/vacationImages/pexels-axp-photography-500641970-19149614.jpg",//
  "/vacationImages/pexels-chiecharon-672358.jpg",//
  "/vacationImages/pexels-christian-alemu-127251395-30999221.jpg",//
  "/vacationImages/pexels-clifford-mervil-988071-2398220.jpg",
  "/vacationImages/pexels-entumoto-17831035.jpg",//
  "/vacationImages/pexels-fmaderebner-238622.jpg",//
  "/vacationImages/pexels-cliford-mervil-988071-2398220", //
  "/vacationImages/pexels-freestockpro-1008155.jpg",//
  "/vacationImages/pexels-gabriela-palai-129458-404960.jpg",//
  "/vacationImages/pexels-haleyve-2087391.jpg", //
  "/vacationImages/pexels-heyho-7746467.jpg",//
  "/vacationImages/pexels-heyho-7746551.jpg",//
  "/vacationImages/pexels-jimmy-teoh-294331-1010657.jpg",//
  "/vacationImages/pexels-kampus-7895758.jpg",//
  "/vacationImages/pexels-kindelmedia-7863777.jpg", //
  "/vacationImages/pexels-learda-shkurti-1281959-2446683.jpg", //
  "/vacationImages/pexels-mohamed-hussain-629997-30951335.jpg",//
  "/vacationImages/pexels-pixabay-38238.jpg",//
  "/vacationImages/pexels-pixabay-208701.jpg",//
  "/vacationImages/pexels-recalmedia-60217.jpg",//
  "/vacationImages/pexels-riciardus-307008.jpg",//
  "/vacationImages/pexels-rpnickson-2609463.jpg", //
  "/vacationImages/pexels-tatianasyrikova-3934023.jpg",//
  "/vacationImages/pexels-te-lensfix-380994-1371360.jpg"//
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

    return () => clearInterval(interval);
  }, [shuffledImages]);

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
