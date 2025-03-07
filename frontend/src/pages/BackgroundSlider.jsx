import React, { useState, useEffect } from "react";
import "../styles/BackgroundSlider.css"; // Keep your CSS for general styling

const desktopImages = [
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

const mobileImages = [
  "mobileVacationImages/pic1.jpg",
  "mobileVacationImages/pic2.jpg",
  "mobileVacationImages/pic3.jpg",
  "mobileVacationImages/pic4.jpg",
  "mobileVacationImages/pic5.jpg",
  "mobileVacationImages/pic6.jpg",
  "mobileVacationImages/pic7.jpg",
  "mobileVacationImages/pic8.jpg",
  "mobileVacationImages/pic9.jpg",
  "mobileVacationImages/pic10.jpg",
  "mobileVacationImages/pic11.jpg",
  "mobileVacationImages/pic12.jpg",
  "mobileVacationImages/pic13.jpg",
  "mobileVacationImages/pic14.jpg",
  "mobileVacationImages/pic15.jpg",
  "mobileVacationImages/pic16.jpg",
  "mobileVacationImages/pic17.jpg",
  "mobileVacationImages/pic18.jpg",
  "mobileVacationImages/pic19.jpg",
  "mobileVacationImages/pic20.jpg",
  "mobileVacationImages/pic21.jpg",
  "mobileVacationImages/pic22.jpg",
  "mobileVacationImages/pic23.jpg",
  "mobileVacationImages/pic24.jpg",
  "mobileVacationImages/pic25.jpg",
  "mobileVacationImages/pic26.jpg",
  "mobileVacationImages/pic27.jpg",
  "mobileVacationImages/pic28.jpg",
  "mobileVacationImages/pic29.jpg",
  "mobileVacationImages/pic30.jpg",
  "mobileVacationImages/pic31.jpg",
  "mobileVacationImages/pic32.jpg",
  "mobileVacationImages/pic33.jpg",
  "mobileVacationImages/pic34.jpg"
]


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
  const [mobilePhone, setMobilePhone] = useState(window.innerWidth <= 768); //
  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(mobilePhone ? mobileImages : desktopImages));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      if(mobile !== mobilePhone){
        setMobilePhone(mobile)
        setShuffledImages(shuffleArray(mobile ? mobileImages : desktopImages));
        setCurrentIndex(0)
      }
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobilePhone])
  
  useEffect(() => {
    if(shuffledImages.length === 0) return;
    
    console.log("Currently displaying:", shuffledImages[currentIndex]); // Logs each image change


    //Preload the next image before switching
    const nextIndex = (currentIndex + 1) % shuffledImages.length
    const img = new Image()
    img.src = shuffledImages[nextIndex]

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 < shuffledImages.length) {
          return prevIndex + 1;
        } else {
          // If we reach the end, reshuffle and restart at 0
          setShuffledImages(shuffleArray(mobilePhone ? mobileImages : desktopImages));
          return 0;
        }
      });
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, shuffledImages]); // Dependencies

  // return (
  //   <div className="background-container">
  //     <div
  //       className="background-slider previous-image" //old image will fade out
  //       style={{
  //         backgroundImage: `url(${shuffledImages[(currentIndex - 1 + shuffledImages.length) % shuffledImages.length]})`,
  //       }}
  //     ></div>
  //     <div
  //       className="background-slider next-image" //new image will fade in
  //       style={{
  //         backgroundImage: `url(${shuffledImages[currentIndex]})`,
  //       }}
  //     ></div>

  //   </div>
  // );
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
