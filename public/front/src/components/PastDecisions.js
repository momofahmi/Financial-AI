import React from "react";
import "./PastDecisions.css";

const LessonsLearned = () => {
  const lessons = [
    {
      title: "Improved Customer Feedback Loop",
      date: "1/15/2023",
      description:
        "Implementing a robust customer feedback system led to faster product improvements and increased customer satisfaction.",
      tags: ["Operational", "impact-high"],
    },
    {
      title: "Diversification of Supply Chain",
      date: "3/22/2023",
      description:
        "Diversifying our supply chain helped mitigate risks and ensure business continuity during global disruptions.",
      tags: ["Strategic", "impact-medium"],
    },
    {
      title: "Investment in Employee Training",
      date: "5/10/2023",
      description:
        "Increased investment in employee training programs resulted in higher productivity and lower turnover rates.",
      tags: ["Operational", "impact-high"],
    },
    {
      title: "Adoption of Agile Methodologies",
      date: "7/5/2023",
      description:
        "Transitioning to Agile methodologies in our development process improved project delivery times and quality.",
      tags: ["Strategic", "impact-medium"],
    },
  ];

  const handleAnalyze = () => {
    console.log("Analyze button clicked");
    alert("Starting analysis...");
  };

  return (
    <div className="lessons-container">
      <h1>Lessons Learned</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h2>Total Lessons</h2>
          <p>4</p>
        </div>
        <div className="summary-card">
          <h2>Operational Lessons</h2>
          <p>2</p>
        </div>
        <div className="summary-card">
          <h2>Strategic Lessons</h2>
          <p>2</p>
        </div>
        <div className="summary-card">
          <h2>High Impact Lessons</h2>
          <p>2</p>
        </div>
      </div>

      {/* Button Group */}
      <div className="button-group">
        <button className="add-lesson-button">+ Add New Lesson</button>
        <button className="analyze-button" onClick={handleAnalyze}>
          Analyze
        </button>
      </div>

      {/* Lessons List */}
      <div className="lessons-list">
        {lessons.map((lesson, index) => (
          <div key={index} className="lesson-card">
            <h3>{lesson.title}</h3>
            <p className="lesson-date">{lesson.date}</p>
            <p>{lesson.description}</p>
            <div className="lesson-tags">
              {lesson.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className={`tag ${tag}`}>
                  {tag.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsLearned;
