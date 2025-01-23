import React, { useState } from "react";
import "./SignupPage.css";
import google from "../photos/google.png";
import apple from "../photos/apple.png";

// Import the logo image
import logoPath from "../photos/file.png";

const SignupPage = ({ closeSignupModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Top Section with Logo and Close Button */}
        <div className="modal-header">
          <img src={logoPath} alt="Logo" className="logo-top-left" />
          <button className="close-btn" onClick={closeSignupModal}>
            X
          </button>
        </div>

        <div className="signup-container">
          {/* Tabs */}
          <div className="tab-container">
            <button className="tab signin-tab">Sign In</button>
            <button className="tab signup-tab active">Sign Up</button>
          </div>

          {/* Signup Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Password Confirm</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          {/* Social Buttons */}
          <div className="social-buttons">
            <button className="google-button">
              <img src={google} alt="Google" />
              Sign Up with Google
            </button>
            <button className="apple-button">
              <img src={apple} alt="Apple" />
              Sign Up with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
