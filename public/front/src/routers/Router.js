import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navigator from "../navigation_bar/NavigationBar";
import MainPage from "../main_page/MainPage";
import SigninPage from "../signin_signup_pages/SigninPage";
import SignupPage from "../signin_signup_pages/SignupPage";
import Dashboard from "../dashboard/Dashboard";
import Upload from "../upload_page/UploadPage";
import Forecast from "../forecast_page/Forecast";
import ScenarioAnalysis from "../ScenarioAnalysis/ScenarioAnalysis";
import DataPage from "../DataPage/DataPage";
import LessonsLearned from "../components/PastDecisions";
import CompaniesPage from "../companies_page/CompaniesPage";

const AppRouter = ({
  openSigninModal,
  openSignupModal,
  isSigninOpen,
  isSignupOpen,
  closeSigninModal,
  closeSignupModal,
}) => {
  return (
    <Router>
      <div
        className={`app-container ${
          isSigninOpen || isSignupOpen ? "blur" : ""
        }`}
      >
        <Navigator
          openSigninModal={openSigninModal}
          openSignupModal={openSignupModal}
        />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/scenario-analysis" element={<ScenarioAnalysis />} />
        </Routes>
      </div>
      {isSigninOpen && <SigninPage closeSigninModal={closeSigninModal} />}
      {isSignupOpen && <SignupPage closeSignupModal={closeSignupModal} />}
    </Router>
  );
};

export default AppRouter;
