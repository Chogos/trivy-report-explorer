// Type definitions for Trivy JSON report

// Base report interface that all report types will extend
export interface BaseReport {
  reportType: ReportType;
  displayName: string;
  description?: string;
}

// Original Trivy Report for Vulnerabilities
export interface TrivyReport extends BaseReport {
  SchemaVersion: number;
  ArtifactName: string;
  ArtifactType: string;
  Metadata: Metadata;
  Results: Result[];
}

export interface Metadata {
  OS?: {
    Family: string;
    Name: string;
  };
  ImageID?: string;
  DiffIDs?: string[];
  RepoTags?: string[];
  RepoDigests?: string[];
  ImageConfig?: any;
}

export interface Result {
  Target: string;
  Class: string;
  Type: string;
  Vulnerabilities?: Vulnerability[];
}

export interface Vulnerability {
  VulnerabilityID: string;
  PkgName: string;
  InstalledVersion: string;
  FixedVersion?: string;
  Title?: string;
  Description?: string;
  // Additional properties added when processing results
  Target?: string;
  Class?: string;
  Type?: string;
  Severity: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  References?: string[];
  PublishedDate?: string;
  LastModifiedDate?: string;
  CVSS?: {
    nvd?: CVSSScore;
    redhat?: CVSSScore;
  };
  CweIDs?: string[];
  Status?: string;
}

export interface CVSSScore {
  V2Vector?: string;
  V3Vector?: string;
  V2Score?: number;
  V3Score?: number;
}

// Type definitions for EKS CIS report format
export interface EKSCISReport extends BaseReport {
  ID: string;
  Title: string;
  SummaryControls: EKSCISControl[];
}

export interface EKSCISControl {
  ID: string;
  Name: string;
  Severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  TotalFail?: number;
}

// Type definitions for Misconfig report format
export interface MisconfigReport extends BaseReport {
  Results: MisconfigResult[];
}

export interface MisconfigResult {
  Target: string;
  Class: string;
  Type: string;
  Misconfigurations: Misconfiguration[];
}

export interface Misconfiguration extends BaseFinding {
  ID: string;
  Title: string;
  Description: string;
  Message: string;
  Resolution: string;
  Severity: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  PrimaryURL: string;
  References: string[];
  Status: string;
  Layer?: {
    DiffID: string;
    Digest: string;
  };
}

// Type definitions for License report format
export interface LicenseReport extends BaseReport {
  Results: LicenseResult[];
}

export interface LicenseResult {
  Target: string;
  Class: string;
  Type: string;
  Licenses: License[];
}

export interface License extends BaseFinding {
  Name: string;
  Category: string;
  PkgName: string;
  FilePath: string;
  Link: string;
  Confidence: number;
}

// Type definitions for Secret report format
export interface SecretReport extends BaseReport {
  Results: SecretResult[];
}

export interface SecretResult {
  Target: string;
  Class: string;
  Type: string;
  Secrets: Secret[];
}

export interface Secret extends BaseFinding {
  Category: string;
  RuleID: string;
  Title: string;
  StartLine: number;
  EndLine: number;
  Match: string;
  Layer?: {
    DiffID: string;
    Digest: string;
  };
}

// Base type for any finding in a report (vulnerability, misconfig, etc.)
export interface BaseFinding {
  id: string;
  title: string;
  description?: string;
  severity: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
}

// Union type for all supported report types
export type SupportedReport =
  | TrivyReport
  | EKSCISReport
  | MisconfigReport
  | LicenseReport
  | SecretReport;

// Type to determine report type
export enum ReportType {
  TRIVY_VULNERABILITY = 'TRIVY_VULNERABILITY',
  EKS_CIS = 'EKS_CIS',
  TRIVY_MISCONFIG = 'TRIVY_MISCONFIG',
  TRIVY_LICENSE = 'TRIVY_LICENSE',
  TRIVY_SECRET = 'TRIVY_SECRET',
  UNKNOWN = 'UNKNOWN',
}

// Registry of report types and their properties
export interface ReportTypeInfo {
  id: ReportType;
  name: string;
  description: string;
  exampleCommand: string;
  detectFn: (json: any) => boolean;
  transformFn?: (json: any) => any;
}

export interface FilterOptions {
  severity: string[];
  status: string[];
  resourceType: string[];
  packageName: string;
  hideZeroFailedTests: boolean;
}

export interface SortOptions {
  field: 'severity' | 'count' | 'resource' | 'package';
  direction: 'asc' | 'desc';
}
