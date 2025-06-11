import React, { useState } from 'react';
import { useReport } from '../context/ReportContext';
import { FilterOptions, ReportType } from '../types';
import { FilterConfig } from '../types/reportConfig';
import { getReportConfig } from '../utils/reportConfigRegistry';

const FilterManager: React.FC = () => {
  const { report, reportType, filters, setFilters, sortOptions, setSortOptions } = useReport();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!report) return null;

  const reportConfig = getReportConfig(reportType);
  const { availableFilters, availableSorts } = reportConfig;

  // Extract unique resource types based on report type (for dynamic filters)
  const getResourceTypes = () => {
    if (reportType === ReportType.TRIVY_VULNERABILITY) {
      const types = (report as any).Results.map((result: any) => result.Type);
      const uniqueTypes = Array.from(new Set(types));
      return uniqueTypes.map((type: any) => ({ value: String(type), label: String(type) }));
    }
    return [];
  };

  const resourceTypes: { value: string, label: string }[] = getResourceTypes();

  // Generic filter handlers
  const handleMultiSelectChange = (filterId: string, value: string) => {
    const currentValues = (filters as any)[filterId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [filterId]: newValues
    });
  };

  const handleTextChange = (filterId: string, value: string) => {
    setFilters({
      ...filters,
      [filterId]: value
    });
  };

  const handleCheckboxChange = (filterId: string, checked: boolean) => {
    setFilters({
      ...filters,
      [filterId]: checked
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-');
    setSortOptions({
      field: field as any,
      direction: direction as 'asc' | 'desc'
    });
  };

  const clearFilters = () => {
    const clearedFilters: any = {
      severity: [],
      status: [],
      resourceType: [],
      packageName: '',
      hideZeroFailedTests: false,
    };

    // Set any custom defaults from filter configs
    availableFilters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        clearedFilters[filter.id] = filter.defaultValue;
      }
    });

    setFilters(clearedFilters);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    availableFilters.forEach(filter => {
      const value = (filters as any)[filter.id];
      if (filter.type === 'severity' || filter.type === 'status' || filter.type === 'resourceType') {
        count += Array.isArray(value) ? value.length : 0;
      } else if (filter.type === 'text' || filter.type === 'packageName') {
        count += value ? 1 : 0;
      } else if (filter.type === 'checkbox') {
        count += value ? 1 : 0;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Render different filter types
  const renderFilter = (filter: FilterConfig) => {
    const value = (filters as any)[filter.id];

    switch (filter.type) {
      case 'severity':
      case 'status':
        return (
          <div key={filter.id} className="mb-4 w-full">
            <label className="block text-sm font-medium mb-2">{filter.name}</label>
            <div className="flex flex-wrap gap-2">
              {filter.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelectChange(filter.id, option.value)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors
                    ${value?.includes(option.value)
                      ? `${option.color} ${option.textColor} ring-2 ring-offset-1 ring-github-blue`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {option.color && (
                    <span className={`w-2 h-2 rounded-full ${option.color} mr-2 ${!value?.includes(option.value) && 'opacity-70'}`}></span>
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'resourceType':
        const resourceOptions = resourceTypes.length > 0 ? resourceTypes : (filter.options || []);
        if (resourceOptions.length === 0) return null;

        return (
          <div key={filter.id}>
            <label className="block text-sm font-medium mb-2">{filter.name}</label>
            <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
              {resourceOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${filter.id}-${option.value}`}
                    checked={value?.includes(option.value) || false}
                    onChange={() => handleMultiSelectChange(filter.id, option.value)}
                    className="w-4 h-4 text-github-blue focus:ring-github-blue border-gray-300 rounded"
                  />
                  <label htmlFor={`${filter.id}-${option.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
      case 'packageName':
        return (
          <div key={filter.id}>
            <label htmlFor={filter.id} className="block text-sm font-medium mb-2">
              {filter.name}
            </label>
            <div className="relative">
              <input
                type="text"
                id={filter.id}
                value={value || ''}
                onChange={(e) => handleTextChange(filter.id, e.target.value)}
                className="block w-full border border-github-border rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent"
                placeholder={filter.placeholder}
              />
              {value && (
                <button
                  onClick={() => handleTextChange(filter.id, '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={filter.id} className="mb-4 w-full">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={filter.id}
                checked={value || false}
                onChange={(e) => handleCheckboxChange(filter.id, e.target.checked)}
                className="w-4 h-4 text-github-blue focus:ring-github-blue border-gray-300 rounded"
              />
              <label htmlFor={filter.id} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                {filter.name}
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Separate filters into always visible and expandable
  const alwaysVisibleFilters = availableFilters.filter(f =>
    f.type === 'severity' || f.isReportSpecific
  );
  const expandableFilters = availableFilters.filter(f =>
    f.type !== 'severity' && !f.isReportSpecific
  );

  return (
    <div className="bg-white rounded-md border border-github-border p-4 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-github-blue text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-github-blue hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
          {expandableFilters.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 hover:text-github-blue flex items-center"
            >
              {isExpanded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Expand
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Always visible controls */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        {/* Always visible filters */}
        {alwaysVisibleFilters.map(filter => renderFilter(filter))}

        {/* Sort Controls */}
        <div className="w-full sm:w-auto">
          <label htmlFor="sort-by" className="block text-sm font-medium mb-1">
            Sort by
          </label>
          <div className="relative">
            <select
              id="sort-by"
              value={`${sortOptions.field}-${sortOptions.direction}`}
              onChange={handleSortChange}
              className="appearance-none block w-full bg-white border border-github-border rounded px-4 py-2 pr-8 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-github-blue focus:border-transparent"
            >
              {availableSorts.map((sort) => (
                <option key={`${sort.field}-${sort.direction}`} value={`${sort.field}-${sort.direction}`}>
                  {sort.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable additional filters */}
      {isExpanded && expandableFilters.length > 0 && (
        <div className="pt-4 border-t border-github-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expandableFilters.map(filter => renderFilter(filter))}
        </div>
      )}

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="mt-4 pt-3 border-t border-github-border">
          <div className="flex flex-wrap items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {availableFilters.map(filter => {
                const value = (filters as any)[filter.id];
                if (!value) return null;

                if (filter.type === 'severity' || filter.type === 'status') {
                  return value.map((val: string) => {
                    const option = filter.options?.find(opt => opt.value === val);
                    return (
                      <span
                        key={`active-${filter.id}-${val}`}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100"
                      >
                        {option?.color && <span className={`w-2 h-2 rounded-full ${option.color} mr-1`}></span>}
                        {option?.label || val}
                        <button
                          onClick={() => handleMultiSelectChange(filter.id, val)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  });
                } else if (filter.type === 'resourceType') {
                  return value.map((val: string) => (
                    <span
                      key={`active-${filter.id}-${val}`}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100"
                    >
                      Resource: {val}
                      <button
                        onClick={() => handleMultiSelectChange(filter.id, val)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ));
                } else if (filter.type === 'text' || filter.type === 'packageName') {
                  return (
                    <span
                      key={`active-${filter.id}`}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100"
                    >
                      {filter.name}: "{value}"
                      <button
                        onClick={() => handleTextChange(filter.id, '')}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  );
                } else if (filter.type === 'checkbox' && value) {
                  return (
                    <span
                      key={`active-${filter.id}`}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100"
                    >
                      {filter.name}
                      <button
                        onClick={() => handleCheckboxChange(filter.id, false)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterManager;
