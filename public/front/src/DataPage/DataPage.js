import React, { useState } from "react";
import "./DataPage.css";
import Calendar from "./Calendar";

const DataPage = ({ goToMainPage }) => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    console.log(`Selected ${selectedYear} ${quarter}`);
  };

  return (
    <div className="data-page">
      {/* Header Section */}
      <header className="data-header">
        <h1 className="company-title">Financial AI</h1>
      </header>

      {/* Calendar Component in the Right Corner */}
      <Calendar
        selectedYear={selectedYear}
        onQuarterSelect={handleQuarterSelect}
      />

      {/* Footer Section */}
      <footer className="data-footer">
        <button className="back-btn" onClick={goToMainPage}>
          Back to Main Page
        </button>
      </footer>
    </div>
  );
};

export default DataPage;
