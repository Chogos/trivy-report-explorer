import React from 'react';

import { BaseFinding, License } from '../../types';
import { DetailModal } from '../modals/DetailModal';

interface LicenseViewProps {
  findings: (BaseFinding & License)[];
  onItemSelect: (item: (BaseFinding & License) | null) => void;
  selectedItem: (BaseFinding & License) | null;
}

export const LicenseView: React.FC<LicenseViewProps> = ({
  findings,
  onItemSelect,
  selectedItem,
}) => {
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
                  Category
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  License
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Package
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Confidence
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  File Path
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-github-border'>
              {findings.map(license => (
                <tr
                  key={`${license.Name}-${license.FilePath || ''}`}
                  className='hover:bg-github-bg cursor-pointer'
                  onClick={() => onItemSelect(license)}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        license.Category === 'restricted'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {license.Category}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-github-blue'>
                      {license.Name}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm'>{license.PkgName}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm'>
                      {Math.round(license.Confidence * 100)}%
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm truncate max-w-xs'>
                      {license.FilePath}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='bg-github-bg px-6 py-3 border-t border-github-border'>
          <p className='text-sm text-gray-500'>
            Showing {findings.length} licenses
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
                <h3 className='text-lg font-medium mb-2'>License Details</h3>
                <table className='min-w-full'>
                  <tbody>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        License Name
                      </td>
                      <td className='py-2 text-sm'>{selectedItem.Name}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        Category
                      </td>
                      <td className='py-2 text-sm'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedItem.Category === 'restricted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {selectedItem.Category}
                        </span>
                      </td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>Package</td>
                      <td className='py-2 text-sm'>{selectedItem.PkgName}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        File Path
                      </td>
                      <td className='py-2 text-sm'>{selectedItem.FilePath}</td>
                    </tr>
                    <tr className='border-t border-github-border'>
                      <td className='py-2 pr-4 text-sm font-medium'>
                        Confidence
                      </td>
                      <td className='py-2 text-sm'>
                        {Math.round(selectedItem.Confidence * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>

                {selectedItem.Link && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-medium mb-2'>
                      License Information
                    </h3>
                    <a
                      href={selectedItem.Link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-github-blue hover:underline'
                    >
                      View License Details
                    </a>
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
