import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationBar.css";
import MacroEconomicDatas from "./MacroEconomicDatas";

// Import the logo directly from the src/photos folder
import logoPath from "../photos/file.png";

const Navigator = ({ openSigninModal, openSignupModal }) => {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          {/* Use a non-clickable container for the logo and text */}
          <div className="logo-container">
            <img
              src={logoPath}
              alt="Financial AI Logo"
              className="logo-image"
            />
            <span className="logo-text">Financial AI</span>
          </div>
        </div>
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "non-active-link" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/companies"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Companies
          </NavLink>
          <NavLink
            to="/scenario-analysis"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Scenario Analysis
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Upload
          </NavLink>
          <NavLink
            to="/forecast"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Forecast
          </NavLink>
          <button className="signin-btn" onClick={openSigninModal}>
            Sign In
          </button>
          <button className="signup-btn" onClick={openSignupModal}>
            Sign Up
          </button>
        </div>
      </nav>
      <MacroEconomicDatas />
    </div>
  );
};

export default Navigator;
