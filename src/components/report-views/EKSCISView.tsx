import React from 'react';

import { BaseFinding, EKSCISControl } from '../../types';
import { DetailModal } from '../modals/DetailModal';

interface EKSCISViewProps {
  findings: (BaseFinding & EKSCISControl)[];
  onItemSelect: (item: (BaseFinding & EKSCISControl) | null) => void;
  selectedItem: (BaseFinding & EKSCISControl) | null;
}

export const EKSCISView: React.FC<EKSCISViewProps> = ({
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
                  Control ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Name
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Failed Tests
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-github-border'>
              {findings.map(control => (
                <tr
                  key={control.ID || control.id || `control-${control.Name}`}
                  className='hover:bg-github-bg cursor-pointer'
                  onClick={() => onItemSelect(control)}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(control.severity)}`}
                    >
                      {control.severity.toLowerCase()}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-github-blue'>{control.ID}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm'>{control.Name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm'>{control.TotalFail || 0}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='bg-github-bg px-6 py-3 border-t border-github-border'>
          <p className='text-sm text-gray-500'>
            Showing {findings.length} failed controls
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
                <h3 className='text-lg font-medium mb-2'>Control Details</h3>
                <table className='min-w-full'>
                  <tbody>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        Control ID
                      </td>
                      <td className='py-2 text-sm'>{selectedItem.ID}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>Name</td>
                      <td className='py-2 text-sm'>{selectedItem.Name}</td>
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
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        Failed Tests
                      </td>
                      <td className='py-2 text-sm'>
                        {selectedItem.TotalFail || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        />
      )}
    </>
  );
};
