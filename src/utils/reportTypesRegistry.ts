import { ReportType, ReportTypeInfo, SupportedReport } from '../types';

// Registry of all supported report types
const reportTypes: ReportTypeInfo[] = [
  {
    id: ReportType.TRIVY_VULNERABILITY,
    name: 'Vulnerability Report',
    description:
      'Trivy vulnerability scan results for container images, filesystems, or repositories',
    exampleCommand: 'trivy image --format json -o report.json [image-name]',
    detectFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return Boolean(
        report.SchemaVersion &&
          report.ArtifactName &&
          Array.isArray(report.Results) &&
          report.Results.some((r: Record<string, unknown>) => r.Vulnerabilities)
      );
    },
    transformFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return {
        ...report,
        reportType: ReportType.TRIVY_VULNERABILITY,
        displayName: `Vulnerability Scan: ${report.ArtifactName}`,
        description: `Scan type: ${report.ArtifactType}`,
      };
    },
  },
  {
    id: ReportType.EKS_CIS,
    name: 'EKS CIS Benchmark',
    description: 'Center for Internet Security (CIS) benchmark for Amazon EKS',
    exampleCommand:
      'trivy k8s --format json -o eks-cis-report.json cluster --compliance=eks-cis',
    detectFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return Boolean(
        report.ID &&
          report.Title &&
          typeof report.Title === 'string' &&
          report.Title.includes('EKS CIS') &&
          Array.isArray(report.SummaryControls)
      );
    },
    transformFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return {
        ...report,
        reportType: ReportType.EKS_CIS,
        displayName: report.Title,
        description: `EKS CIS Benchmark: ${report.ID}`,
      };
    },
  },
  {
    id: ReportType.TRIVY_MISCONFIG,
    name: 'Misconfiguration Report',
    description:
      'Trivy infrastructure as code (IaC) and configuration scanning',
    exampleCommand:
      'trivy config --format json -o misconfig-report.json [directory]',
    detectFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return Boolean(
        report.Results &&
          Array.isArray(report.Results) &&
          report.Results.some(
            (r: Record<string, unknown>) => r.Misconfigurations
          )
      );
    },
    transformFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return {
        ...report,
        reportType: ReportType.TRIVY_MISCONFIG,
        displayName: `Misconfiguration Scan: ${report.ArtifactName || 'Unknown'}`,
        description: `Configuration scan for ${report.ArtifactType || 'file system'}`,
      };
    },
  },
  {
    id: ReportType.TRIVY_SECRET,
    name: 'Secret Scanning Report',
    description: 'Trivy secret scanning results',
    exampleCommand:
      'trivy fs --format json --security-checks secret -o secret-report.json [directory]',
    detectFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return Boolean(
        report.Results &&
          Array.isArray(report.Results) &&
          report.Results.some((r: Record<string, unknown>) => r.Secrets)
      );
    },
    transformFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return {
        ...report,
        reportType: ReportType.TRIVY_SECRET,
        displayName: `Secret Scan: ${report.ArtifactName || 'Unknown'}`,
        description: `Secret scan for ${report.ArtifactType || 'file system'}`,
      };
    },
  },
  {
    id: ReportType.TRIVY_LICENSE,
    name: 'License Scanning Report',
    description: 'Trivy software license scanning results',
    exampleCommand:
      'trivy fs --format json --security-checks license -o license-report.json [directory]',
    detectFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return Boolean(
        report.Results &&
          Array.isArray(report.Results) &&
          report.Results.some((r: Record<string, unknown>) => r.Licenses)
      );
    },
    transformFn: (json: unknown) => {
      const report = json as Record<string, unknown>;
      return {
        ...report,
        reportType: ReportType.TRIVY_LICENSE,
        displayName: `License Scan: ${report.ArtifactName || 'Unknown'}`,
        description: `License scan for ${report.ArtifactType || 'file system'}`,
      };
    },
  },
];

/**
 * Detects the report type from a JSON object
 * @param json The parsed JSON object from a Trivy report
 * @returns The detected report type or UNKNOWN if not recognized
 */
export function detectReportType(json: unknown): {
  type: ReportType;
  info: ReportTypeInfo | undefined;
  transformedData: SupportedReport | null;
} {
  for (const reportTypeInfo of reportTypes) {
    try {
      if (reportTypeInfo.detectFn(json)) {
        const transformedData = reportTypeInfo.transformFn
          ? reportTypeInfo.transformFn(json)
          : {
              ...(json as Record<string, unknown>),
              reportType: reportTypeInfo.id,
            };

        return {
          type: reportTypeInfo.id,
          info: reportTypeInfo,
          transformedData: transformedData as SupportedReport,
        };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Error checking if JSON matches ${reportTypeInfo.id}:`,
        error
      );
    }
  }

  return {
    type: ReportType.UNKNOWN,
    info: undefined,
    transformedData: null,
  };
}

/**
 * Gets all registered report types
 */
export function getAllReportTypes(): ReportTypeInfo[] {
  return reportTypes;
}

/**
 * Gets info for a specific report type
 */
export function getReportTypeInfo(
  type: ReportType
): ReportTypeInfo | undefined {
  return reportTypes.find(rt => rt.id === type);
}
