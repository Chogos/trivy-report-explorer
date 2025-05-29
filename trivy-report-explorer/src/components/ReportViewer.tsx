import React, { useState } from 'react';
import { useReport } from '../context/ReportContext';
import {
  BaseFinding,
  ReportType,
  Vulnerability,
  EKSCISControl,
  Misconfiguration,
  License,
  Secret
} from '../types';
import { VulnerabilityView } from './report-views/VulnerabilityView';
import { EKSCISView } from './report-views/EKSCISView';
import { MisconfigurationView } from './report-views/MisconfigurationView';
import { LicenseView } from './report-views/LicenseView';
import { SecretView } from './report-views/SecretView';
import { GenericReportView } from './report-views/GenericReportView';

const ReportViewer: React.FC = () => {
  const { reportType, getFilteredFindings } = useReport();
  const [selectedItem, setSelectedItem] = useState<BaseFinding | null>(null);

  const items = getFilteredFindings();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-md border border-github-border p-8 text-center">
        <p className="text-gray-500">No items found matching the current filters.</p>
      </div>
    );
  }

  // Render the appropriate view based on report type
  switch(reportType) {
    case ReportType.TRIVY_VULNERABILITY:
      return <VulnerabilityView
        findings={items as (BaseFinding & Vulnerability)[]}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem as (BaseFinding & Vulnerability) | null}
      />;

    case ReportType.EKS_CIS:
      return <EKSCISView
        findings={items as (BaseFinding & EKSCISControl)[]}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem as (BaseFinding & EKSCISControl) | null}
      />;

    case ReportType.TRIVY_MISCONFIG:
      return <MisconfigurationView
        findings={items as (BaseFinding & Misconfiguration)[]}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem as (BaseFinding & Misconfiguration) | null}
      />;

    case ReportType.TRIVY_LICENSE:
      return <LicenseView
        findings={items as (BaseFinding & License)[]}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem as (BaseFinding & License) | null}
      />;

    case ReportType.TRIVY_SECRET:
      return <SecretView
        findings={items as (BaseFinding & Secret)[]}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem as (BaseFinding & Secret) | null}
      />;

    default:
      // Fallback to a generic view for unsupported report types
      return <GenericReportView
        findings={items}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem}
      />;
  }
};

export default ReportViewer;
