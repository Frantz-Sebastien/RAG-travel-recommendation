import BackgroundSlider from "./BackgroundSlider.jsx"
import { Link } from "react-router-dom"
import "../styles/Home.css"

const Home = () => {
    return (
      <div>
          <BackgroundSlider />
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
          
          <a href="/testing">Testing FrontEnd-BackEnd connection</a>

          {/* ✅ Use a real button inside the Link */}
          <Link to="/profile" className="button-wrapper">
            <button className="custom-btn">Find your Dream Trip</button>
          </Link>

        </div>
      </div>
    );
};

export default Home;

