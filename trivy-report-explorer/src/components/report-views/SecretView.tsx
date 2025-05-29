import React from 'react';
import { BaseFinding, Secret } from '../../types';
import { DetailModal } from '../modals/DetailModal';

interface SecretViewProps {
  findings: (BaseFinding & Secret)[];
  onItemSelect: (item: BaseFinding & Secret) => void;
  selectedItem: (BaseFinding & Secret) | null;
}

export const SecretView: React.FC<SecretViewProps> = ({
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
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-github-border">
              {findings.map((secret, index) => (
                <tr
                  key={`${secret.id}-${index}`}
                  className="hover:bg-github-bg cursor-pointer"
                  onClick={() => onItemSelect(secret)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(secret.severity)}`}>
                      {secret.severity.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs bg-github-bg rounded px-2 py-1">
                      {secret.Category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-github-blue">
                      {secret.RuleID}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {secret.Title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      Line {secret.StartLine}{secret.StartLine !== secret.EndLine ? `-${secret.EndLine}` : ''}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-github-bg px-6 py-3 border-t border-github-border">
          <p className="text-sm text-gray-500">
            Showing {findings.length} secrets
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
                <h3 className="text-lg font-medium mb-2">Secret Details</h3>
                <table className="min-w-full">
                  <tbody>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Category</td>
                      <td className="py-2 text-sm">{selectedItem.Category}</td>
                    </tr>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Rule ID</td>
                      <td className="py-2 text-sm">{selectedItem.RuleID}</td>
                    </tr>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Title</td>
                      <td className="py-2 text-sm">{selectedItem.Title}</td>
                    </tr>
                    <tr className="border-t border-github-border">
                      <td className="py-2 pr-4 text-sm font-medium">Location</td>
                      <td className="py-2 text-sm">
                        Line {selectedItem.StartLine}
                        {selectedItem.StartLine !== selectedItem.EndLine ? `-${selectedItem.EndLine}` : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Matched Content</h3>
                  <pre className="bg-github-bg rounded p-4 text-sm overflow-x-auto">
                    {selectedItem.Match}
                  </pre>
                </div>

                {selectedItem.Layer && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Container Layer</h3>
                    <table className="min-w-full">
                      <tbody>
                        <tr className="border-t border-github-border">
                          <td className="py-2 pr-4 text-sm font-medium">DiffID</td>
                          <td className="py-2 text-sm font-mono">{selectedItem.Layer.DiffID}</td>
                        </tr>
                        <tr className="border-t border-github-border">
                          <td className="py-2 pr-4 text-sm font-medium">Digest</td>
                          <td className="py-2 text-sm font-mono">{selectedItem.Layer.Digest}</td>
                        </tr>
                      </tbody>
                    </table>
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
