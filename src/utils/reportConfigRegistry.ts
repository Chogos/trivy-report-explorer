import React from 'react';
import {
  ReportType,
  BaseFinding,
  FilterOptions,
  SortOptions,
  Vulnerability,
  EKSCISControl,
  Misconfiguration,
  License,
  Secret
} from '../types';
import { ReportConfig, FilterConfig, SortConfig, ReportConfigRegistry } from '../types/reportConfig';

// Import view components
import { VulnerabilityView } from '../components/report-views/VulnerabilityView';
import { EKSCISView } from '../components/report-views/EKSCISView';
import { MisconfigurationView } from '../components/report-views/MisconfigurationView';
import { LicenseView } from '../components/report-views/LicenseView';
import { SecretView } from '../components/report-views/SecretView';
import { GenericReportView } from '../components/report-views/GenericReportView';

// Common filter configurations
const severityFilterConfig: FilterConfig = {
  id: 'severity',
  name: 'Severity',
  type: 'severity',
  options: [
    { value: 'CRITICAL', label: 'Critical', color: 'bg-github-red', textColor: 'text-white' },
    { value: 'HIGH', label: 'High', color: 'bg-github-orange', textColor: 'text-white' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-github-yellow', textColor: 'text-gray-900' },
    { value: 'LOW', label: 'Low', color: 'bg-github-green', textColor: 'text-white' },
    { value: 'UNKNOWN', label: 'Unknown', color: 'bg-github-gray', textColor: 'text-white' },
  ]
};

const statusFilterConfig: FilterConfig = {
  id: 'status',
  name: 'Status',
  type: 'status',
  options: [
    { value: 'fixed', label: 'Fixed', color: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'affected', label: 'Affected', color: 'bg-red-100', textColor: 'text-red-800' },
    { value: 'unknown', label: 'Unknown', color: 'bg-gray-100', textColor: 'text-gray-800' },
  ]
};

const resourceTypeFilterConfig: FilterConfig = {
  id: 'resourceType',
  name: 'Resource Type',
  type: 'resourceType'
};

const packageNameFilterConfig: FilterConfig = {
  id: 'packageName',
  name: 'Package Name',
  type: 'text',
  placeholder: 'Filter by package name'
};

// Common sort configurations
const severitySortConfig: SortConfig[] = [
  { field: 'severity', label: 'Severity (High to Low)', direction: 'desc' },
  { field: 'severity', label: 'Severity (Low to High)', direction: 'asc' },
];

const resourceSortConfig: SortConfig[] = [
  { field: 'resource', label: 'Resource (A-Z)', direction: 'asc' },
  { field: 'resource', label: 'Resource (Z-A)', direction: 'desc' },
];

// Helper functions for common filtering and sorting
const applySeverityFilter = (data: any[], filters: FilterOptions): any[] => {
  if (filters.severity.length === 0) return data;
  return data.filter(item => filters.severity.includes(item.Severity || item.severity));
};

const applyStatusFilter = (data: any[], filters: FilterOptions): any[] => {
  if (filters.status.length === 0) return data;
  return data.filter(item => item.Status && filters.status.includes(item.Status));
};

const applyResourceTypeFilter = (data: any[], filters: FilterOptions): any[] => {
  if (filters.resourceType.length === 0) return data;
  return data.filter(item => item.Type && filters.resourceType.includes(item.Type));
};

const applyPackageNameFilter = (data: any[], filters: FilterOptions): any[] => {
  if (!filters.packageName) return data;
  return data.filter(item =>
    item.PkgName?.toLowerCase().includes(filters.packageName.toLowerCase())
  );
};

const applySeveritySort = <T extends BaseFinding>(data: T[], sortOptions: SortOptions): T[] => {
  const severityOrder: Record<string, number> = {
    CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, UNKNOWN: 0
  };

  return data.sort((a, b) => {
    const direction = sortOptions.direction === 'asc' ? 1 : -1;
    const aSeverity = severityOrder[a.severity] || 0;
    const bSeverity = severityOrder[b.severity] || 0;
    return (bSeverity - aSeverity) * direction;
  });
};

// Report configurations
const vulnerabilityConfig: ReportConfig<BaseFinding & Vulnerability> = {
  id: ReportType.TRIVY_VULNERABILITY,
  name: 'Vulnerability Report',
  description: 'Trivy vulnerability scan results for container images, filesystems, or repositories',
  exampleCommand: 'trivy image --format json -o report.json [image-name]',

  detectFn: (json: any) => {
    return Boolean(
      json.SchemaVersion &&
      json.ArtifactName &&
      Array.isArray(json.Results) &&
      json.Results.some((r: any) => r.Vulnerabilities)
    );
  },

  transformFn: (json: any) => ({
    ...json,
    reportType: ReportType.TRIVY_VULNERABILITY,
    displayName: `Vulnerability Scan: ${json.ArtifactName}`,
    description: `Scan type: ${json.ArtifactType}`
  }),

  viewComponent: VulnerabilityView,

  availableFilters: [
    severityFilterConfig,
    statusFilterConfig,
    resourceTypeFilterConfig,
    packageNameFilterConfig
  ],

  filterFn: (allVulnerabilities: Vulnerability[], filters: FilterOptions) => {
    let filtered = applySeverityFilter(allVulnerabilities, filters);
    filtered = applyStatusFilter(filtered, filters);
    filtered = applyResourceTypeFilter(filtered, filters);
    filtered = applyPackageNameFilter(filtered, filters);
    return filtered.map(vuln => ({
      ...vuln,
      id: vuln.VulnerabilityID,
      title: vuln.Title || vuln.VulnerabilityID,
      description: vuln.Description,
      severity: vuln.Severity,
      type: 'vulnerability'
    })) as (BaseFinding & Vulnerability)[];
  },

  availableSorts: [
    ...severitySortConfig,
    ...resourceSortConfig
  ],

  sortFn: (data: (BaseFinding & Vulnerability)[], sortOptions: SortOptions) => {
    switch (sortOptions.field) {
      case 'severity':
        return applySeveritySort(data, sortOptions);
      case 'resource':
        const direction = sortOptions.direction === 'asc' ? 1 : -1;
        return data.sort((a, b) => ((a as any).Target || '').localeCompare(((b as any).Target || '')) * direction);
      default:
        return data;
    }
  },

  mapToBaseFinding: (allVulnerabilities: Vulnerability[]) => {
    return allVulnerabilities.map(vuln => ({
      ...vuln,
      id: vuln.VulnerabilityID,
      title: vuln.Title || vuln.VulnerabilityID,
      description: vuln.Description,
      severity: vuln.Severity,
      type: 'vulnerability'
    })) as (BaseFinding & Vulnerability)[];
  }
};

const eksConfig: ReportConfig<BaseFinding & EKSCISControl> = {
  id: ReportType.EKS_CIS,
  name: 'EKS CIS Benchmark',
  description: 'Center for Internet Security (CIS) benchmark for Amazon EKS',
  exampleCommand: 'trivy k8s --format json -o eks-cis-report.json cluster --compliance=eks-cis',

  detectFn: (json: any) => {
    return Boolean(
      json.ID &&
      json.Title &&
      json.Title.includes('EKS CIS') &&
      Array.isArray(json.SummaryControls)
    );
  },

  transformFn: (json: any) => ({
    ...json,
    reportType: ReportType.EKS_CIS,
    displayName: json.Title,
    description: `EKS CIS Benchmark: ${json.ID}`
  }),

  viewComponent: EKSCISView,

  availableFilters: [
    severityFilterConfig,
    {
      id: 'hideZeroFailedTests',
      name: 'Hide controls with zero failed tests',
      type: 'checkbox',
      defaultValue: false,
      isReportSpecific: true
    }
  ],

  filterFn: (controls: EKSCISControl[], filters: FilterOptions) => {
    let filtered = applySeverityFilter(controls, filters);

    // Apply EKS-specific filter
    if (filters.hideZeroFailedTests) {
      filtered = filtered.filter(control => (control.TotalFail || 0) > 0);
    }

    return filtered as (BaseFinding & EKSCISControl)[];
  },

  availableSorts: [
    ...severitySortConfig,
    { field: 'resource', label: 'Control ID (A-Z)', direction: 'asc' },
    { field: 'resource', label: 'Control ID (Z-A)', direction: 'desc' },
  ],

  sortFn: (data: (BaseFinding & EKSCISControl)[], sortOptions: SortOptions) => {
    switch (sortOptions.field) {
      case 'severity':
        return applySeveritySort(data, sortOptions);
      case 'resource':
        const direction = sortOptions.direction === 'asc' ? 1 : -1;
        return data.sort((a, b) => a.ID.localeCompare(b.ID) * direction);
      default:
        return data;
    }
  },

  mapToBaseFinding: (controls: EKSCISControl[]) => {
    return controls.map(control => ({
      ...control,
      id: control.ID,
      title: control.Name,
      severity: control.Severity,
      type: 'eks-control'
    })) as (BaseFinding & EKSCISControl)[];
  }
};

const misconfigConfig: ReportConfig<BaseFinding & Misconfiguration> = {
  id: ReportType.TRIVY_MISCONFIG,
  name: 'Misconfiguration Report',
  description: 'Trivy infrastructure as code (IaC) and configuration scanning',
  exampleCommand: 'trivy config --format json -o misconfig-report.json [directory]',

  detectFn: (json: any) => {
    return Boolean(
      json.Results &&
      Array.isArray(json.Results) &&
      json.Results.some((r: any) => r.Misconfigurations)
    );
  },

  transformFn: (json: any) => ({
    ...json,
    reportType: ReportType.TRIVY_MISCONFIG,
    displayName: `Misconfiguration Scan: ${json.ArtifactName || 'Unknown'}`,
    description: `Configuration scan for ${json.ArtifactType || 'file system'}`
  }),

  viewComponent: MisconfigurationView,

  availableFilters: [
    severityFilterConfig,
    statusFilterConfig,
    resourceTypeFilterConfig
  ],

  filterFn: (misconfigs: Misconfiguration[], filters: FilterOptions) => {
    let filtered = applySeverityFilter(misconfigs, filters);
    filtered = applyStatusFilter(filtered, filters);
    filtered = applyResourceTypeFilter(filtered, filters);
    return filtered as (BaseFinding & Misconfiguration)[];
  },

  availableSorts: [
    ...severitySortConfig,
    ...resourceSortConfig
  ],

  sortFn: (data: (BaseFinding & Misconfiguration)[], sortOptions: SortOptions) => {
    switch (sortOptions.field) {
      case 'severity':
        return applySeveritySort(data, sortOptions);
      case 'resource':
        const direction = sortOptions.direction === 'asc' ? 1 : -1;
        return data.sort((a, b) => ((a.type || '').localeCompare(b.type || '')) * direction);
      default:
        return data;
    }
  },

  mapToBaseFinding: (misconfigs: Misconfiguration[]) => {
    return misconfigs.map(misconfig => ({
      ...misconfig,
      id: misconfig.ID,
      title: misconfig.Title,
      description: misconfig.Description,
      severity: misconfig.Severity,
      type: 'misconfiguration'
    })) as (BaseFinding & Misconfiguration)[];
  }
};

const licenseConfig: ReportConfig<BaseFinding & License> = {
  id: ReportType.TRIVY_LICENSE,
  name: 'License Scanning Report',
  description: 'Trivy software license scanning results',
  exampleCommand: 'trivy fs --format json --security-checks license -o license-report.json [directory]',

  detectFn: (json: any) => {
    return Boolean(
      json.Results &&
      Array.isArray(json.Results) &&
      json.Results.some((r: any) => r.Licenses)
    );
  },

  transformFn: (json: any) => ({
    ...json,
    reportType: ReportType.TRIVY_LICENSE,
    displayName: `License Scan: ${json.ArtifactName || 'Unknown'}`,
    description: `License scan for ${json.ArtifactType || 'file system'}`
  }),

  viewComponent: LicenseView,

  availableFilters: [
    resourceTypeFilterConfig,
    packageNameFilterConfig
  ],

  filterFn: (licenses: License[], filters: FilterOptions) => {
    let filtered = applyResourceTypeFilter(licenses, filters);
    filtered = applyPackageNameFilter(filtered, filters);
    return filtered as (BaseFinding & License)[];
  },

  availableSorts: [
    ...resourceSortConfig,
    { field: 'package', label: 'Package (A-Z)', direction: 'asc' },
    { field: 'package', label: 'Package (Z-A)', direction: 'desc' },
  ],

  sortFn: (data: (BaseFinding & License)[], sortOptions: SortOptions) => {
    const direction = sortOptions.direction === 'asc' ? 1 : -1;
    switch (sortOptions.field) {
      case 'resource':
        return data.sort((a, b) => ((a.type || '').localeCompare(b.type || '')) * direction);
      case 'package':
        return data.sort((a, b) => ((a.PkgName || '').localeCompare(b.PkgName || '')) * direction);
      default:
        return data;
    }
  },

  mapToBaseFinding: (licenses: License[]) => {
    return licenses.map(license => ({
      ...license,
      id: `${license.PkgName}-${license.Name}`,
      title: license.Name,
      severity: 'UNKNOWN' as const,
      type: 'license'
    })) as (BaseFinding & License)[];
  }
};

const secretConfig: ReportConfig<BaseFinding & Secret> = {
  id: ReportType.TRIVY_SECRET,
  name: 'Secret Scanning Report',
  description: 'Trivy secret scanning results',
  exampleCommand: 'trivy fs --format json --security-checks secret -o secret-report.json [directory]',

  detectFn: (json: any) => {
    return Boolean(
      json.Results &&
      Array.isArray(json.Results) &&
      json.Results.some((r: any) => r.Secrets)
    );
  },

  transformFn: (json: any) => ({
    ...json,
    reportType: ReportType.TRIVY_SECRET,
    displayName: `Secret Scan: ${json.ArtifactName || 'Unknown'}`,
    description: `Secret scan for ${json.ArtifactType || 'file system'}`
  }),

  viewComponent: SecretView,

  availableFilters: [
    severityFilterConfig,
    resourceTypeFilterConfig
  ],

  filterFn: (secrets: Secret[], filters: FilterOptions) => {
    let filtered = applySeverityFilter(secrets, filters);
    filtered = applyResourceTypeFilter(filtered, filters);
    return filtered as (BaseFinding & Secret)[];
  },

  availableSorts: [
    ...severitySortConfig,
    ...resourceSortConfig
  ],

  sortFn: (data: (BaseFinding & Secret)[], sortOptions: SortOptions) => {
    switch (sortOptions.field) {
      case 'severity':
        return applySeveritySort(data, sortOptions);
      case 'resource':
        const direction = sortOptions.direction === 'asc' ? 1 : -1;
        return data.sort((a, b) => ((a.type || '').localeCompare(b.type || '')) * direction);
      default:
        return data;
    }
  },

  mapToBaseFinding: (secrets: Secret[]) => {
    return secrets.map(secret => ({
      ...secret,
      id: `${secret.RuleID}-${secret.StartLine}`,
      title: secret.Title,
      severity: 'HIGH' as const, // Secrets are generally high severity
      type: 'secret'
    })) as (BaseFinding & Secret)[];
  }
};

// Generic fallback config
const genericConfig: ReportConfig<BaseFinding> = {
  id: ReportType.UNKNOWN,
  name: 'Generic Report',
  description: 'Fallback for unknown report types',
  exampleCommand: '',

  detectFn: () => false,

  viewComponent: GenericReportView,

  availableFilters: [severityFilterConfig],

  filterFn: (data: any[], filters: FilterOptions) => {
    return applySeverityFilter(data, filters);
  },

  availableSorts: [...severitySortConfig],

  sortFn: (data: BaseFinding[], sortOptions: SortOptions) => {
    return applySeveritySort(data, sortOptions);
  },

  mapToBaseFinding: (data: any[]) => data
};

// Registry of all report configurations
export const reportConfigRegistry: ReportConfigRegistry = {
  [ReportType.TRIVY_VULNERABILITY]: vulnerabilityConfig,
  [ReportType.EKS_CIS]: eksConfig,
  [ReportType.TRIVY_MISCONFIG]: misconfigConfig,
  [ReportType.TRIVY_LICENSE]: licenseConfig,
  [ReportType.TRIVY_SECRET]: secretConfig,
  [ReportType.UNKNOWN]: genericConfig
};

// Helper functions to access registry
export const getReportConfig = (reportType: ReportType): ReportConfig => {
  return reportConfigRegistry[reportType] || genericConfig;
};

export const detectReportTypeFromRegistry = (json: any): {
  type: ReportType;
  config: ReportConfig;
  transformedData: any | null;
} => {
  for (const config of Object.values(reportConfigRegistry)) {
    if (config.detectFn(json)) {
      const transformedData = config.transformFn ? config.transformFn(json) : { ...json, reportType: config.id };

      return {
        type: config.id,
        config,
        transformedData
      };
    }
  }

  return {
    type: ReportType.UNKNOWN,
    config: genericConfig,
    transformedData: null
  };
};

export const getAllReportConfigs = (): ReportConfig[] => {
  return Object.values(reportConfigRegistry).filter(config => config.id !== ReportType.UNKNOWN);
};
