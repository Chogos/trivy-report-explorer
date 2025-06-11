import React from 'react';
import { ReportType, BaseFinding, FilterOptions, SortOptions } from './index';

// Enhanced filter configuration for each report type
export interface FilterConfig {
  id: string;
  name: string;
  type: 'severity' | 'status' | 'resourceType' | 'packageName' | 'checkbox' | 'text';
  options?: Array<{ value: string; label: string; color?: string; textColor?: string }>;
  placeholder?: string;
  defaultValue?: any;
  isReportSpecific?: boolean; // Whether this filter is specific to this report type
}

// Sort configuration for each report type
export interface SortConfig {
  field: string;
  label: string;
  direction: 'asc' | 'desc';
}

// View component interface - now generic to handle different data types
export interface ViewComponent<T = BaseFinding> {
  findings: T[];
  onItemSelect: (item: T) => void;
  selectedItem: T | null;
}

// Complete report configuration - now generic
export interface ReportConfig<T = BaseFinding> {
  id: ReportType;
  name: string;
  description: string;
  exampleCommand: string;

  // Detection and transformation
  detectFn: (json: any) => boolean;
  transformFn?: (json: any) => any;

  // UI Configuration
  viewComponent: React.ComponentType<ViewComponent<T>>;

  // Filtering Configuration
  availableFilters: FilterConfig[];
  filterFn: (data: any[], filters: FilterOptions) => T[];

  // Sorting Configuration
  availableSorts: SortConfig[];
  sortFn: (data: T[], sortOptions: SortOptions) => T[];

  // Data mapping
  mapToBaseFinding: (data: any[]) => T[];
}

// Registry type for all report configurations
export type ReportConfigRegistry = Record<ReportType, ReportConfig<any>>;
