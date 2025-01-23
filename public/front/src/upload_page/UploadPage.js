import React, { useState } from "react";
import "./UploadPage.css";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import DragAndDrop from "../components/DragAndDrop";

const Upload = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState([]);

  const steps = ["Upload File", "View Results"];

  const handleFileUpload = (data) => {
    setFileData(data);
    setActiveStep(1);
  };

  return (
    <div className="file-upload-container">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {isLoading ? (
        <div className="loading-spinner">
          <CircularProgress />
          <p>Processing, please wait...</p>
        </div>
      ) : (
        <>
          {activeStep === 0 && (
            <div>
              <h4 className="upload-header">
                The file to be reported must be uploaded.
              </h4>
              <DragAndDrop
                setLoading={setIsLoading}
                onFileUpload={handleFileUpload}
              />
            </div>
          )}

          {activeStep === 1 && (
            <div className="uploaded-files-display">
              {fileData.length === 0 ? (
                <p className="no-files-text">No Data to Display</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(fileData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td key={idx}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      <div className="stepper-buttons">
        {activeStep === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep(0)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Upload;
