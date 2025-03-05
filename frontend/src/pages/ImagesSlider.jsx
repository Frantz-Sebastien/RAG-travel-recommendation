import React from "react";
import "../styles/ImagesSlider.css"; // Import the CSS file

const ImagesSlider = () => {
  return (
    <div className="slider-container">
      <div className="slider">
        <img src="/public/vacationImages/pexels-asadphoto-457882.jpg" alt="Vacation 1" />
        <img src="/public/vacationImages/pexels-asadphoto-1024989.jpg" alt="Vacation 2" />
        <img src="/public/vacationImages/pexels-asadphoto-1268855.jpg" alt="Vacation 3" />
        <img src="/public/vacationImages/pexels-pixabay-208701.jpg" alt="Vacation 4" />
        <img src="/public/vacationImages/pexels-tatianasyrikova-3934023.jpg" alt="Vacation 5" />
      </div>
    </div>
  );
};

export default ImagesSlider;
