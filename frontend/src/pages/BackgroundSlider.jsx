import React, { useState, useEffect } from "react";
import "../styles/BackgroundSlider.css"; // Keep your CSS for general styling

const images = [
  "/vacationImages/pexels-alexmoliski-28969898.jpg",
  "/vacationImages/pexels-te-lensfix-380994-1371360.jpg",
  "/vacationImages/pexels-asadphoto-1268855.jpg",
  "/vacationImages/pexels-recalmedia-60217.jpg",
  "/vacationImages/pexels-riciardus-307008.jpg",
  "/vacationImages/pexels-pixabay-208701.jpg",
  "/vacationImages/pexels-jimmy-teoh-294331-1010657.jpg",
  "/vacationImages/pexels-asadphoto-1024989.jpg",
  "/vacationImages/pexels-pixabay-38238.jpg",
  "/vacationImages/pexels-freestockpro-1008155.jpg",
  "/vacationImages/pexels-asadphoto-457882.jpg",
  "/vacationImages/pexels-mohamed-hussain-629997-30951335.jpg",
  "/vacationImages/pexels-fmaderebner-238622.jpg",
  "/vacationImages/pexels-tatianasyrikova-3934023.jpg"
  
  
];

const BackgroundSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      className="background-slider"
      style={{
        backgroundImage: `url(${images[currentImage]})`,
      }}
    ></div>
  );
};

export default BackgroundSlider;
