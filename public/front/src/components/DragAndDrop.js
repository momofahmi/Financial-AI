import "./DragAndDrop.css";
import React, { useState } from "react";
import uploadIcon from "./../photos/upload-image.png";
import * as XLSX from "xlsx";

const DragAndDrop = ({ setLoading, onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.classList.contains("drag-drop-container")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.classList.contains("drag-drop-container")) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // No additional logic needed for drag-over in this case
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.classList.contains("drag-drop-container")) {
      setIsDragging(false);
      const files = e.dataTransfer.files;
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        onFileUpload(jsonData);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid Excel file.");
    }
  };

  return (
    <div
      className={`drag-drop-container ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="upload-icon">
        <img src={uploadIcon} alt="Upload Icon" />
      </div>
      <p className="drag-drop-text">
        {isDragging
          ? "Drop the Excel file here"
          : "Drag and drop an Excel file here, or click to select a file"}
      </p>
      <input
        type="file"
        className="file-input"
        onChange={handleFileSelect}
        accept=".xlsx"
      />
    </div>
  );
};

export default DragAndDrop;
