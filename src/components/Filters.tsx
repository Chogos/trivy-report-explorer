import React, { useState } from 'react';

import { useReport } from '../context/ReportContext';
import { ReportType } from '../types';

const severityOptions = [
  {
    value: 'CRITICAL',
    label: 'Critical',
    color: 'bg-github-red',
    textColor: 'text-white',
  },
  {
    value: 'HIGH',
    label: 'High',
    color: 'bg-github-orange',
    textColor: 'text-white',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    color: 'bg-github-yellow',
    textColor: 'text-gray-900',
  },
  {
    value: 'LOW',
    label: 'Low',
    color: 'bg-github-green',
    textColor: 'text-white',
  },
  {
    value: 'UNKNOWN',
    label: 'Unknown',
    color: 'bg-github-gray',
    textColor: 'text-white',
  },
];

const statusOptions = [
  {
    value: 'fixed',
    label: 'Fixed',
    color: 'bg-green-100',
    textColor: 'text-green-800',
  },
  {
    value: 'affected',
    label: 'Affected',
    color: 'bg-red-100',
    textColor: 'text-red-800',
  },
  {
    value: 'unknown',
    label: 'Unknown',
    color: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
];

const Filters: React.FC = () => {
  const {
    report,
    reportType,
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
  } = useReport();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!report) {
    return null;
  }

  // Extract unique resource types based on report type
  const getResourceTypes = () => {
    if (reportType === ReportType.TRIVY_VULNERABILITY) {
      const types = (report as any).Results.map((result: any) => result.Type);
      const uniqueTypes = Array.from(new Set(types));
      return uniqueTypes.map((type: any) => ({
        value: String(type),
        label: String(type),
      }));
    }
    return [];
  };

  const resourceTypes: { value: string; label: string }[] = getResourceTypes();

  const handleSeverityChange = (severity: string) => {
    const newSeverities = filters.severity.includes(severity)
      ? filters.severity.filter((s: string) => s !== severity)
      : [...filters.severity, severity];
    setFilters({
      ...filters,
      severity: newSeverities,
    });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s: string) => s !== status)
      : [...filters.status, status];
    setFilters({
      ...filters,
      status: newStatuses,
    });
  };

  const handleResourceTypeChange = (resourceType: string) => {
    const newResourceTypes = filters.resourceType.includes(resourceType)
      ? filters.resourceType.filter((rt: string) => rt !== resourceType)
      : [...filters.resourceType, resourceType];
    setFilters({
      ...filters,
      resourceType: newResourceTypes,
    });
  };

  const handlePackageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      packageName: e.target.value,
    });
  };

  const handleHideZeroFailedTestsChange = (checked: boolean) => {
    setFilters({
      ...filters,
      hideZeroFailedTests: checked,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-');
    setSortOptions({
      field: field as 'severity' | 'count' | 'resource',
      direction: direction as 'asc' | 'desc',
    });
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      status: [],
      resourceType: [],
      packageName: '',
      hideZeroFailedTests: false,
    });
  };

  // Get the count of active filters
  const activeFilterCount =
    filters.severity.length +
    filters.status.length +
    filters.resourceType.length +
    (filters.packageName ? 1 : 0) +
    (filters.hideZeroFailedTests ? 1 : 0);

  return (
    <div className='bg-white rounded-md border border-github-border p-4 mb-6 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <h3 className='text-lg font-medium'>Filters</h3>
          {activeFilterCount > 0 && (
            <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-github-blue text-white'>
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className='text-sm text-github-blue hover:underline flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              Clear filters
            </button>
          )}
          {/* Hide expand/collapse button for EKS CIS reports since they don't have additional filters */}
          {reportType !== ReportType.EKS_CIS && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-sm text-gray-500 hover:text-github-blue flex items-center'
            >
              {isExpanded ? (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 15l7-7 7 7'
                    />
                  </svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                  Expand
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Always visible controls */}
      <div className='flex flex-wrap items-center justify-between mb-4'>
        {/* Severity Filter Pills */}
        <div className='mb-4 w-full'>
          <label className='block text-sm font-medium mb-2'>Severity</label>
          <div className='flex flex-wrap gap-2'>
            {severityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSeverityChange(option.value)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors
                  ${
                    filters.severity.includes(option.value)
                      ? `${option.color} ${option.textColor} ring-2 ring-offset-1 ring-github-blue`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${option.color} mr-2 ${!filters.severity.includes(option.value) && 'opacity-70'}`}
                ></span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* EKS-specific filter: Hide controls with zero failed tests */}
        {reportType === ReportType.EKS_CIS && (
          <div className='mb-4 w-full'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='hide-zero-failed'
                checked={filters.hideZeroFailedTests}
                onChange={e =>
                  handleHideZeroFailedTestsChange(e.target.checked)
                }
                className='w-4 h-4 text-github-blue focus:ring-github-blue border-gray-300 rounded'
              />
              <label
                htmlFor='hide-zero-failed'
                className='ml-2 text-sm font-medium text-gray-700 cursor-pointer'
              >
                Hide controls with zero failed tests
              </label>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className='w-full sm:w-auto'>
          <label htmlFor='sort-by' className='block text-sm font-medium mb-1'>
            Sort by
          </label>
          <div className='relative'>
            <select
              id='sort-by'
              value={`${sortOptions.field}-${sortOptions.direction}`}
              onChange={handleSortChange}
              className='appearance-none block w-full bg-white border border-github-border rounded px-4 py-2 pr-8 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent'
            >
              <option value='severity-desc'>Severity (High to Low)</option>
              <option value='severity-asc'>Severity (Low to High)</option>
              <option value='resource-asc'>Resource (A-Z)</option>
              <option value='resource-desc'>Resource (Z-A)</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable additional filters - don't show for EKS CIS reports */}
      {isExpanded && reportType !== ReportType.EKS_CIS && (
        <div className='pt-4 border-t border-github-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Status Filter - For vulnerability and misconfiguration reports */}
          {(reportType === ReportType.TRIVY_VULNERABILITY ||
            reportType === ReportType.TRIVY_MISCONFIG) && (
            <div>
              <label className='block text-sm font-medium mb-2'>Status</label>
              <div className='flex flex-wrap gap-2'>
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors
                      ${
                        filters.status.includes(option.value)
                          ? `${option.color} ${option.textColor} ring-1 ring-${option.textColor.replace('text-', '')}`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resource Type Filter */}
          {resourceTypes.length > 0 && (
            <div>
              <label className='block text-sm font-medium mb-2'>
                Resource Type
              </label>
              <div className='max-h-32 overflow-y-auto pr-2 space-y-1'>
                {resourceTypes.map(option => (
                  <div key={option.value} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`resource-${option.value}`}
                      checked={filters.resourceType.includes(option.value)}
                      onChange={() => handleResourceTypeChange(option.value)}
                      className='w-4 h-4 text-github-blue focus:ring-github-blue border-gray-300 rounded'
                    />
                    <label
                      htmlFor={`resource-${option.value}`}
                      className='ml-2 text-sm text-gray-700 cursor-pointer'
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Name Filter - Only show for vulnerability reports */}
          {(reportType === ReportType.TRIVY_VULNERABILITY ||
            reportType === ReportType.TRIVY_LICENSE) && (
            <div>
              <label
                htmlFor='package-name'
                className='block text-sm font-medium mb-2'
              >
                Package Name
              </label>
              <div className='relative'>
                <input
                  type='text'
                  id='package-name'
                  value={filters.packageName}
                  onChange={handlePackageNameChange}
                  className='block w-full border border-github-border rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent'
                  placeholder='Filter by package name'
                />
                {filters.packageName && (
                  <button
                    onClick={() => setFilters({ ...filters, packageName: '' })}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className='mt-4 pt-3 border-t border-github-border'>
          <div className='flex flex-wrap items-center text-sm text-gray-600'>
            <span className='font-medium mr-2'>Active filters:</span>
            <div className='flex flex-wrap gap-2 mt-1'>
              {filters.severity.map(severity => {
                const option = severityOptions.find(
                  opt => opt.value === severity
                );
                return (
                  <span
                    key={`active-${severity}`}
                    className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100'
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${option?.color} mr-1`}
                    ></span>
                    {option?.label}
                    <button
                      onClick={() => handleSeverityChange(severity)}
                      className='ml-1 text-gray-500 hover:text-gray-700'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3 w-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    </button>
                  </span>
                );
              })}

              {filters.status.map(status => (
                <span
                  key={`active-${status}`}
                  className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100'
                >
                  Status: {status}
                  <button
                    onClick={() => handleStatusChange(status)}
                    className='ml-1 text-gray-500 hover:text-gray-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </span>
              ))}

              {filters.resourceType.map(type => (
                <span
                  key={`active-${type}`}
                  className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100'
                >
                  Resource: {type}
                  <button
                    onClick={() => handleResourceTypeChange(type)}
                    className='ml-1 text-gray-500 hover:text-gray-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </span>
              ))}

              {filters.packageName && (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100'>
                  Package: "{filters.packageName}"
                  <button
                    onClick={() => setFilters({ ...filters, packageName: '' })}
                    className='ml-1 text-gray-500 hover:text-gray-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </span>
              )}

              {filters.hideZeroFailedTests && (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100'>
                  Hide zero failed tests
                  <button
                    onClick={() => handleHideZeroFailedTestsChange(false)}
                    className='ml-1 text-gray-500 hover:text-gray-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
