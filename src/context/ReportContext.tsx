import React, { createContext, useState, useContext, ReactNode } from 'react';

import {
  BaseReport,
  TrivyReport,
  FilterOptions,
  SortOptions,
  EKSCISReport,
  SupportedReport,
  ReportType,
  BaseFinding,
  MisconfigReport,
  LicenseReport,
  SecretReport,
} from '../types';
import {
  detectReportTypeFromRegistry,
  getReportConfig,
} from '../utils/reportConfigRegistry';

interface ReportContextType {
  report: SupportedReport | null;
  reportType: ReportType;
  setReport: (json: any) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  sortOptions: SortOptions;
  setSortOptions: (sortOptions: SortOptions) => void;
  getFilteredFindings: () => BaseFinding[];
  getReportTitle: () => string;
  getReportDescription: () => string;
  getFilterableFields: () => { id: string; name: string }[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [report, setReportState] = useState<SupportedReport | null>(null);
  const [reportType, setReportType] = useState<ReportType>(ReportType.UNKNOWN);
  const [filters, setFilters] = useState<FilterOptions>({
    severity: [],
    status: [],
    resourceType: [],
    packageName: '',
    hideZeroFailedTests: false,
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'severity',
    direction: 'desc',
  });

  const setReport = (json: any) => {
    const { type, transformedData } = detectReportTypeFromRegistry(json);

    if (transformedData) {
      setReportState(transformedData);
      setReportType(type);
    } else {
      console.error('Unknown report type');
      setReportState(null);
      setReportType(ReportType.UNKNOWN);
    }
  };

  const getReportTitle = (): string => {
    if (!report) {
      return '';
    }

    return (report as BaseReport).displayName || 'Unknown Report';
  };

  const getReportDescription = (): string => {
    if (!report) {
      return '';
    }

    return (report as BaseReport).description || '';
  };

  const getFilterableFields = () => {
    const config = getReportConfig(reportType);
    return config.availableFilters.map(filter => ({
      id: filter.id,
      name: filter.name,
    }));
  };

  // Convert any report type to a list of findings for consistent UI display
  const getFilteredFindings = (): BaseFinding[] => {
    if (!report) {
      return [];
    }

    const config = getReportConfig(reportType);

    // Extract raw data based on report type
    let rawData: any[] = [];

    switch (reportType) {
      case ReportType.TRIVY_VULNERABILITY:
        const trivyReport = report as TrivyReport;
        trivyReport.Results.forEach(result => {
          if (result.Vulnerabilities) {
            const vulnerabilitiesWithContext = result.Vulnerabilities.map(
              vuln => ({
                ...vuln,
                Target: result.Target,
                Class: result.Class,
                Type: result.Type,
              })
            );
            rawData = [...rawData, ...vulnerabilitiesWithContext];
          }
        });
        break;

      case ReportType.EKS_CIS:
        const eksReport = report as EKSCISReport;
        rawData = [...eksReport.SummaryControls];
        break;

      case ReportType.TRIVY_MISCONFIG:
        const misconfigReport = report as MisconfigReport;
        misconfigReport.Results.forEach(result => {
          if (result.Misconfigurations) {
            const misconfigsWithContext = result.Misconfigurations.map(
              misconfig => ({
                ...misconfig,
                Target: result.Target,
                Class: result.Class,
                Type: result.Type,
              })
            );
            rawData = [...rawData, ...misconfigsWithContext];
          }
        });
        break;

      case ReportType.TRIVY_LICENSE:
        const licenseReport = report as LicenseReport;
        licenseReport.Results.forEach(result => {
          if (result.Licenses) {
            const licensesWithContext = result.Licenses.map(license => ({
              ...license,
              Target: result.Target,
              Class: result.Class,
              Type: result.Type,
            }));
            rawData = [...rawData, ...licensesWithContext];
          }
        });
        break;

      case ReportType.TRIVY_SECRET:
        const secretReport = report as SecretReport;
        secretReport.Results.forEach(result => {
          if (result.Secrets) {
            const secretsWithContext = result.Secrets.map(secret => ({
              ...secret,
              Target: result.Target,
              Class: result.Class,
              Type: result.Type,
            }));
            rawData = [...rawData, ...secretsWithContext];
          }
        });
        break;

      default:
        return [];
    }

    // Apply filtering using the report config
    const filtered = config.filterFn(rawData, filters);

    // Apply sorting using the report config
    const sorted = config.sortFn(filtered, sortOptions);

    // Map to BaseFinding format
    return config.mapToBaseFinding(sorted);
  };

  const value = {
    report,
    reportType,
    setReport,
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
    getFilteredFindings,
    getReportTitle,
    getReportDescription,
    getFilterableFields,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
