import BackgroundSlider from "./BackgroundSlider.jsx"
import ImagesSlider from "./ImagesSlider.jsx"


const Home = () => {
    return (
      <div>
        <BackgroundSlider />
        <h1>Welcome to the Travel Recommender</h1>
        <p>Discover personalized travel recommendations based on your preferences.</p>
        <a href="/profile">Go to Profile</a><br />
        <a href="/testing">Testing FrontEnd-BackEnd connection</a>
        {/* <ImagesSlider /> */}
      </div>
    );
  };
  
  export default Home;
  