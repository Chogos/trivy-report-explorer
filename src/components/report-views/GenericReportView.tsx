import React from 'react';

import { BaseFinding } from '../../types';
import { DetailModal } from '../modals/DetailModal';

interface GenericReportViewProps {
  findings: BaseFinding[];
  onItemSelect: (item: BaseFinding | null) => void;
  selectedItem: BaseFinding | null;
}

export const GenericReportView: React.FC<GenericReportViewProps> = ({
  findings,
  onItemSelect,
  selectedItem,
}) => {
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
    <>
      <div className='bg-white rounded-md border border-github-border overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-github-border'>
            <thead className='bg-github-bg'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Severity
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Title
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-github-border'>
              {findings.map(finding => (
                <tr
                  key={finding.id}
                  className='hover:bg-github-bg cursor-pointer'
                  onClick={() => onItemSelect(finding)}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}
                    >
                      {finding.severity.toLowerCase()}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-github-blue'>{finding.id}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm'>{finding.title}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-xs bg-github-bg rounded px-2 py-1'>
                      {finding.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='bg-github-bg px-6 py-3 border-t border-github-border'>
          <p className='text-sm text-gray-500'>
            Showing {findings.length} findings
          </p>
        </div>
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => onItemSelect(null)}
          renderContent={() => (
            <>
              <div className='mt-6'>
                <h3 className='text-lg font-medium mb-2'>Finding Details</h3>
                <table className='min-w-full'>
                  <tbody>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>ID</td>
                      <td className='py-2 text-sm'>{selectedItem.id}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>Title</td>
                      <td className='py-2 text-sm'>{selectedItem.title}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>Type</td>
                      <td className='py-2 text-sm'>{selectedItem.type}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        Severity
                      </td>
                      <td className='py-2 text-sm'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedItem.severity)}`}
                        >
                          {selectedItem.severity.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {selectedItem.description && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-medium mb-2'>Description</h3>
                    <p className='text-gray-700 whitespace-pre-line'>
                      {selectedItem.description}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        />
      )}
    </>
  );
};
