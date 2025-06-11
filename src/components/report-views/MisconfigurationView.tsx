import React from 'react';
import { BaseFinding, Misconfiguration } from '../../types';
import { DetailModal } from '../modals/DetailModal';

interface MisconfigurationViewProps {
  findings: (BaseFinding & Misconfiguration)[];
  onItemSelect: (item: BaseFinding & Misconfiguration) => void;
  selectedItem: (BaseFinding & Misconfiguration) | null;
}

export const MisconfigurationView: React.FC<MisconfigurationViewProps> = ({
  findings,
  onItemSelect,
  selectedItem
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
      <div className="bg-white rounded-md border border-github-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-github-border">
            <thead className="bg-github-bg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-github-border">
              {findings.map((misconfig, index) => (
                <tr
                  key={`${misconfig.id}-${index}`}
                  className="hover:bg-github-bg cursor-pointer"
                  onClick={() => onItemSelect(misconfig)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(misconfig.severity)}`}>
                      {misconfig.severity.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-github-blue">
                      {misconfig.ID}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {misconfig.Title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      misconfig.Status === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {misconfig.Status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs bg-github-bg rounded px-2 py-1">
                      {misconfig.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-github-bg px-6 py-3 border-t border-github-border">
          <p className="text-sm text-gray-500">
            Showing {findings.length} misconfigurations
          </p>
        </div>
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => onItemSelect(null as any)}
          renderContent={() => (
            <>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Misconfiguration Details</h3>
                <table className="min-w-full">
                  <tbody>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">ID</td>
                      <td className="py-2 text-sm">{selectedItem.ID}</td>
                    </tr>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Title</td>
                      <td className="py-2 text-sm">{selectedItem.Title}</td>
                    </tr>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Status</td>
                      <td className="py-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedItem.Status === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedItem.Status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Message</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedItem.Message}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Resolution</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedItem.Resolution}
                  </p>
                </div>

                {selectedItem.References && selectedItem.References.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">References</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedItem.References.map((ref, index) => (
                        <li key={index} className="text-sm">
                          <a
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-github-blue hover:underline"
                          >
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
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
