// src/App.js
import React, { useState } from "react";
import "./App.css";
import AppRouter from "./routers/Router";

const App = () => {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isSigninOpen, setSigninOpen] = useState(false);

  const openSignupModal = () => setSignupOpen(true);
  const closeSignupModal = () => setSignupOpen(false);

  const openSigninModal = () => setSigninOpen(true);
  const closeSigninModal = () => setSigninOpen(false);

  return (
    <AppRouter
      openSigninModal={openSigninModal}
      openSignupModal={openSignupModal}
      isSigninOpen={isSigninOpen}
      isSignupOpen={isSignupOpen}
      closeSigninModal={closeSigninModal}
      closeSignupModal={closeSignupModal}
    />
  );
};

export default App;
