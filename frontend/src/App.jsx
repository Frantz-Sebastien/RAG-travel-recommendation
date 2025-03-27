import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EchoTest from "./components/EchoTest";
import TravelNavbar from "./pages/TravelNavbar";
import About from "./pages/About";


function App() {
  return (
    <Router>
      <TravelNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/testing" element={<EchoTest />} />
      </Routes>
    </Router>
  );
}

export default App;
