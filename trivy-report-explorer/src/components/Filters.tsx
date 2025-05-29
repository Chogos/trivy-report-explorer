import React from 'react';
import { useReport } from '../context/ReportContext';
import { FilterOptions, ReportType } from '../types';

const severityOptions = [
  { value: 'CRITICAL', label: 'Critical', color: 'bg-github-red' },
  { value: 'HIGH', label: 'High', color: 'bg-github-orange' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-github-yellow' },
  { value: 'LOW', label: 'Low', color: 'bg-github-green' },
  { value: 'UNKNOWN', label: 'Unknown', color: 'bg-github-gray' },
];

const statusOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'affected', label: 'Affected' },
  { value: 'unknown', label: 'Unknown' },
];

const Filters: React.FC = () => {
  const { report, reportType, filters, setFilters, sortOptions, setSortOptions } = useReport();

  if (!report) return null;

  // Extract unique resource types based on report type
  const getResourceTypes = () => {
    if (reportType === ReportType.TRIVY_VULNERABILITY) {
      const types = (report as any).Results.map((result: any) => result.Type);
      const uniqueTypes = Array.from(new Set(types));
      return uniqueTypes.map((type: any) => ({ value: String(type), label: String(type) }));
    }
    return [];
  };

  const resourceTypes: { value: string, label: string }[] = getResourceTypes();

  const handleSeverityChange = (severity: string) => {
    const newSeverities = filters.severity.includes(severity)
      ? filters.severity.filter((s: string) => s !== severity)
      : [...filters.severity, severity];
    setFilters({
      ...filters,
      severity: newSeverities
    });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s: string) => s !== status)
      : [...filters.status, status];
    setFilters({
      ...filters,
      status: newStatuses
    });
  };

  const handleResourceTypeChange = (resourceType: string) => {
    const newResourceTypes = filters.resourceType.includes(resourceType)
      ? filters.resourceType.filter((rt: string) => rt !== resourceType)
      : [...filters.resourceType, resourceType];
    setFilters({
      ...filters,
      resourceType: newResourceTypes
    });
  };

  const handlePackageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      packageName: e.target.value
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-');
    setSortOptions({
      field: field as 'severity' | 'count' | 'resource',
      direction: direction as 'asc' | 'desc'
    });
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      status: [],
      resourceType: [],
      packageName: '',
    });
  };

  return (
    <div className="bg-white rounded-md border border-github-border p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Severity</label>
          <div className="space-y-2">
            {severityOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`severity-${option.value}`}
                  checked={filters.severity.includes(option.value)}
                  onChange={() => handleSeverityChange(option.value)}
                  className="mr-2"
                />
                <div className={`w-3 h-3 rounded-full ${option.color} mr-2`}></div>
                <label htmlFor={`severity-${option.value}`} className="text-sm cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter - Only show for vulnerability reports */}
        {reportType === ReportType.TRIVY_VULNERABILITY && (
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${option.value}`}
                    checked={filters.status.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`status-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Type Filter - Only show for vulnerability reports */}
        {reportType === ReportType.TRIVY_VULNERABILITY && resourceTypes.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Resource Type</label>
            <div className="space-y-2">
              {resourceTypes.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`resource-${option.value}`}
                    checked={filters.resourceType.includes(option.value)}
                    onChange={() => handleResourceTypeChange(option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`resource-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Name Filter - Only show for vulnerability reports */}
        {reportType === ReportType.TRIVY_VULNERABILITY && (
          <div>
            <label htmlFor="package-name" className="block text-sm font-medium mb-2">
              Package Name
            </label>
            <input
              type="text"
              id="package-name"
              value={filters.packageName}
              onChange={handlePackageNameChange}
              className="w-full border border-github-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent"
              placeholder="Filter by package name"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="sort-by" className="text-sm font-medium mr-2">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={`${sortOptions.field}-${sortOptions.direction}`}
            onChange={handleSortChange}
            className="border border-github-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent"
          >
            <option value="severity-desc">Severity (High to Low)</option>
            <option value="severity-asc">Severity (Low to High)</option>
            <option value="resource-asc">Resource (A-Z)</option>
            <option value="resource-desc">Resource (Z-A)</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm text-github-blue hover:underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
