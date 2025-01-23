import React, { useState } from "react";
import "./Calendar.css";

const getYears = () => {
  const years = [];
  for (let year = 2000; year <= 2024; year++) {
    years.push(year);
  }
  return years;
};

const quarters = ["Q1", "Q2", "Q3", "Q4", "Year"];

const Calendar = ({ onQuarterSelect }) => {
  const [selectedYear, setSelectedYear] = useState(null); // No year selected initially
  const [activeQuarter, setActiveQuarter] = useState("Year");
  const [showYearSelector, setShowYearSelector] = useState(false);

  const handleQuarterClick = (quarter) => {
    if (quarter === "Year") {
      setShowYearSelector(!showYearSelector); // Toggle the year selector visibility
    } else {
      setActiveQuarter(quarter);
      setShowYearSelector(false); // Hide the year selector
      onQuarterSelect(selectedYear, quarter);
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearSelector(false); // Hide the year selector after selecting a year
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-year">
          {selectedYear ? selectedYear : "Year"}
        </h1>
        <div className="quarter-buttons">
          {quarters.map((quarter) => (
            <button
              key={quarter}
              className={`quarter-btn ${
                activeQuarter === quarter ? "active" : ""
              }`}
              onClick={() => handleQuarterClick(quarter)}
              disabled={!selectedYear && quarter !== "Year"} // Disable other quarters until year is selected
            >
              {quarter}
            </button>
          ))}
        </div>
      </div>
      {showYearSelector && (
        <div className="year-selector">
          {getYears().map((year) => (
            <button
              key={year}
              className={`year-btn ${selectedYear === year ? "active" : ""}`}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}
      <div className="calendar-body">
        {selectedYear && activeQuarter !== "Year" && (
          <p className="calendar-quarter-view">
            Displaying Data for {selectedYear} {activeQuarter}
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
