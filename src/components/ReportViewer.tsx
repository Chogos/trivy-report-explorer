import React, { useState } from 'react';

import { useReport } from '../context/ReportContext';
import { BaseFinding } from '../types';
import { getReportConfig } from '../utils/reportConfigRegistry';

const ReportViewer: React.FC = () => {
  const { reportType, getFilteredFindings } = useReport();
  const [selectedItem, setSelectedItem] = useState<BaseFinding | null>(null);

  const items = getFilteredFindings();
  const reportConfig = getReportConfig(reportType);

  if (items.length === 0) {
    return (
      <div className='bg-white rounded-md border border-github-border p-8 text-center'>
        <p className='text-gray-500'>
          No items found matching the current filters.
        </p>
      </div>
    );
  }

  // Get the appropriate view component from the registry
  const ViewComponent = reportConfig.viewComponent;

  return (
    <ViewComponent
      findings={items}
      onItemSelect={setSelectedItem}
      selectedItem={selectedItem}
    />
  );
};

export default ReportViewer;
