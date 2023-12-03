import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Home.css";
import img from "./social.png";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="navbar">
        <div className="left-navbar">
          <h1 className="app-name">One.Digtl</h1>
        </div>
        <div className="right-navbar">
          <Link to="/login">
            {" "}
            {/* Use Link to navigate to the login page */}
            <button className="login-button">Login</button>
          </Link>
          <Link to="/signup">
            {" "}
            {/* Use Link to navigate to the signup page */}
            <button className="signup-button">Sign Up</button>
          </Link>
          <div className="privacy-policy">
            <strong>
              <Link to="/privacy">&#9432;</Link>
            </strong>{" "}
            {/* Link to the privacy policy page */}
          </div>
        </div>
      </div>
      <div className="content">
        <div className="left-content">
          <p>Streamline Your Social Presence with Ease</p>
        </div>
        <div className="right-content">
          <img src={img} alt="App Image" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
