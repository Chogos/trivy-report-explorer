import React from 'react';
import FileUpload from './components/FileUpload';
import Filters from './components/Filters';
import ReportViewer from './components/ReportViewer';
import { ReportProvider, useReport } from './context/ReportContext';
import { ReportType } from './types';
import './App.css';

const AppContent: React.FC = () => {
  const { report, getReportTitle, getReportDescription } = useReport();

  return (
    <div className="min-h-screen bg-github-bg">
      <header className="bg-github-gray text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
              <path d="M10 16H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h8"></path>
              <rect x="16" y="3" width="6" height="6" rx="1"></rect>
            </svg>
            <h1 className="text-xl font-bold">Trivy Report Explorer</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FileUpload />

        {report && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold">{getReportTitle()}</h2>
              <p className="text-sm text-gray-600">
                {getReportDescription()} |
                Scanned: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Filters />
            <ReportViewer />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-github-border mt-8 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Trivy Report Explorer | Powered by React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReportProvider>
      <AppContent />
    </ReportProvider>
  );
};

export default App;
