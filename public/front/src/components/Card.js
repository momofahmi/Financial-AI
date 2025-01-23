import React from "react";
import "./Card.css";

const DashboardCard = ({ title, value, note, bgColor }) => {
  return (
    <div className="dashboard-card" style={{ backgroundColor: bgColor }}>
      <h3>{title}</h3>
      <h2>${value.toLocaleString()}</h2>
      <p>{note}</p>
    </div>
  );
};

export default DashboardCard;
