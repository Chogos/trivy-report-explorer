import React, { useRef, useEffect } from 'react';
import { BaseFinding } from '../../types';

interface DetailModalProps {
  item: BaseFinding;
  onClose: () => void;
  renderContent: () => React.ReactNode;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  onClose,
  renderContent
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-github-red text-white';
      case 'HIGH':
        return 'bg-github-orange text-white';
      case 'MEDIUM':
        return 'bg-github-yellow';
      case 'LOW':
        return 'bg-github-green text-white';
      default:
        return 'bg-github-gray text-white';
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-github-border px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getSeverityColor(item.severity)}`}>
              {item.severity.toLowerCase()}
            </span>
            <h2 className="text-lg font-bold">{item.title || item.id}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <span className="text-gray-500 text-sm">ID: {item.id}</span>
          </div>

          {renderContent()}
        </div>
        <div className="border-t border-github-border px-6 py-4 bg-github-bg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-github-blue text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
