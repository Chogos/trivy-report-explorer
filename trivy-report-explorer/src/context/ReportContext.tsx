import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  BaseReport,
  TrivyReport,
  Vulnerability,
  FilterOptions,
  SortOptions,
  EKSCISReport,
  EKSCISControl,
  SupportedReport,
  ReportType,
  BaseFinding
} from '../types';
import { detectReportType, getReportTypeInfo } from '../utils/reportTypesRegistry';

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
  getFilterableFields: () => { id: string, name: string }[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [report, setReportState] = useState<SupportedReport | null>(null);
  const [reportType, setReportType] = useState<ReportType>(ReportType.UNKNOWN);
  const [filters, setFilters] = useState<FilterOptions>({
    severity: [],
    status: [],
    resourceType: [],
    packageName: '',
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'severity',
    direction: 'desc',
  });

  const setReport = (json: any) => {
    const { type, transformedData } = detectReportType(json);

    if (transformedData) {
      setReportState(transformedData);
      setReportType(type);
    } else {
      console.error("Unknown report type");
      setReportState(null);
      setReportType(ReportType.UNKNOWN);
    }
  };

  const getReportTitle = (): string => {
    if (!report) return '';

    return (report as BaseReport).displayName || 'Unknown Report';
  };

  const getReportDescription = (): string => {
    if (!report) return '';

    return (report as BaseReport).description || '';
  };

  const getFilterableFields = () => {
    switch (reportType) {
      case ReportType.TRIVY_VULNERABILITY:
        return [
          { id: 'severity', name: 'Severity' },
          { id: 'status', name: 'Status' },
          { id: 'resourceType', name: 'Resource Type' },
          { id: 'packageName', name: 'Package Name' }
        ];
      case ReportType.EKS_CIS:
        return [
          { id: 'severity', name: 'Severity' }
        ];
      default:
        return [
          { id: 'severity', name: 'Severity' }
        ];
    }
  };

  // Convert any report type to a list of findings for consistent UI display
  const getFilteredFindings = (): BaseFinding[] => {
    if (!report) return [];

    // Handle Trivy vulnerability reports
    if (reportType === ReportType.TRIVY_VULNERABILITY) {
      const trivyReport = report as TrivyReport;
      let allVulnerabilities: Vulnerability[] = [];

      trivyReport.Results.forEach(result => {
        if (result.Vulnerabilities) {
          // Add target information to each vulnerability for reference
          const vulnerabilitiesWithContext = result.Vulnerabilities.map(vuln => ({
            ...vuln,
            Target: result.Target,
            Class: result.Class,
            Type: result.Type,
          }));

          allVulnerabilities = [...allVulnerabilities, ...vulnerabilitiesWithContext];
        }
      });

      // Apply filters
      let filtered = allVulnerabilities;

      if (filters.severity.length > 0) {
        filtered = filtered.filter(v => filters.severity.includes(v.Severity));
      }

      if (filters.status.length > 0) {
        filtered = filtered.filter(v => v.Status && filters.status.includes(v.Status));
      }

      if (filters.resourceType.length > 0) {
        filtered = filtered.filter(v => v.Type && filters.resourceType.includes(v.Type));
      }

      if (filters.packageName) {
        filtered = filtered.filter(v =>
          v.PkgName.toLowerCase().includes(filters.packageName.toLowerCase())
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const direction = sortOptions.direction === 'asc' ? 1 : -1;

        switch (sortOptions.field) {
          case 'severity':
            const severityOrder: {[key: string]: number} = {
              CRITICAL: 4,
              HIGH: 3,
              MEDIUM: 2,
              LOW: 1,
              UNKNOWN: 0
            };
            const aSeverity = severityOrder[a.Severity] || 0;
            const bSeverity = severityOrder[b.Severity] || 0;
            return (bSeverity - aSeverity) * direction;

          case 'resource':
            return ((a.Target || '').localeCompare(b.Target || '')) * direction;

          default:
            return 0;
        }
      });

      // Map vulnerabilities to BaseFinding format for consistent UI display
      return filtered.map(vuln => ({
        id: vuln.VulnerabilityID,
        title: vuln.Title || vuln.VulnerabilityID,
        description: vuln.Description,
        severity: vuln.Severity,
        type: 'vulnerability',
        ...vuln // Include original vulnerability data for specific rendering
      }));
    }
    // Handle EKS CIS reports
    else if (reportType === ReportType.EKS_CIS) {
      const eksReport = report as EKSCISReport;
      let controls = [...eksReport.SummaryControls];

      // Apply severity filter
      if (filters.severity.length > 0) {
        controls = controls.filter(control =>
          filters.severity.includes(control.Severity)
        );
      }

      // Apply sorting
      controls.sort((a, b) => {
        const direction = sortOptions.direction === 'asc' ? 1 : -1;

        switch (sortOptions.field) {
          case 'severity':
            const severityOrder: {[key: string]: number} = {
              CRITICAL: 4,
              HIGH: 3,
              MEDIUM: 2,
              LOW: 1,
              UNKNOWN: 0
            };
            const aSeverity = severityOrder[a.Severity] || 0;
            const bSeverity = severityOrder[b.Severity] || 0;
            return (bSeverity - aSeverity) * direction;

          case 'resource':
            return a.ID.localeCompare(b.ID) * direction;

          default:
            return 0;
        }
      });

      // Map controls to BaseFinding format for consistent UI display
      return controls.map(control => ({
        id: control.ID,
        title: control.Name,
        severity: control.Severity,
        type: 'eks-control',
        ...control // Include original control data for specific rendering
      }));
    }

    return [];
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

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
