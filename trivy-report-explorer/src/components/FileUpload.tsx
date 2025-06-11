import React, { useState } from 'react';
import { useReport } from '../context/ReportContext';
import { getAllReportConfigs } from '../utils/reportConfigRegistry';

const FileUpload: React.FC = () => {
  const { setReport } = useReport();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileRead = (content: string) => {
    try {
      // First, try to parse the JSON
      const parsedData = JSON.parse(content);

      // Let the registry handle detection and transformation
      setReport(parsedData);
      setError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Failed to parse JSON file. Please ensure the file contains valid JSON.');
      } else {
        setError(`Failed to process the file: ${(err as Error).message}`);
      }
      console.error('Error processing file:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileRead(content);
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileRead(content);
      };
      reader.readAsText(file);
    }
    // Reset the file input to ensure onChange works for subsequent uploads
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Get all supported report types from the registry
  const reportTypes = getAllReportConfigs();

  return (
    <div className="mb-8">
      <div
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors
          ${isDragging
            ? 'border-github-blue bg-blue-50'
            : 'border-github-border hover:border-github-blue'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <h3 className="text-lg font-medium mb-1">Upload Trivy JSON report</h3>
          <p className="text-sm text-gray-500 mb-2">Drag and drop your file here or click to browse</p>
          <p className="text-xs text-gray-400">
            Supports: {reportTypes.map(rt => rt.name).join(', ')}
          </p>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <div className="mt-4">
            <p className="font-medium">Supported report types:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {reportTypes.map((rt, index) => (
                <li key={index}>
                  <p className="font-medium">{rt.name}</p>
                  <p className="text-sm">{rt.description}</p>
                  <code className="block bg-red-100 px-2 py-1 rounded mt-1 text-xs">
                    {rt.exampleCommand}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!error && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
          <p className="font-medium">Looking for a sample report?</p>
          <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                // Reset the file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = '';
                }

                fetch('/sample-report.json')
                  .then(response => response.text())
                  .then(text => handleFileRead(text))
                  .catch(err => setError(`Failed to load sample report: ${err.message}`));
              }}
              className="text-sm text-github-blue hover:underline"
            >
              Load sample Trivy vulnerability report
            </button>
            <button
              onClick={() => {
                // Reset the file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = '';
                }

                fetch('/sample-eks-report.json')
                  .then(response => response.text())
                  .then(text => handleFileRead(text))
                  .catch(err => setError(`Failed to load sample report: ${err.message}`));
              }}
              className="text-sm text-github-blue hover:underline"
            >
              Load sample EKS CIS report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
