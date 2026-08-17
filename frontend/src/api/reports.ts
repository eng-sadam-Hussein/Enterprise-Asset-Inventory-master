import { fetchAuthenticatedBlob } from './client';

export type ReportType = 'assets' | 'stock' | 'assignments' | 'maintenance';
export type ReportFormat = 'excel' | 'pdf';

const FILENAMES: Record<ReportType, Record<ReportFormat, string>> = {
  assets: { excel: 'assets-report.xlsx', pdf: 'assets-report.pdf' },
  stock: { excel: 'stock-report.xlsx', pdf: 'stock-report.pdf' },
  assignments: { excel: 'assignments-report.xlsx', pdf: 'assignments-report.pdf' },
  maintenance: { excel: 'maintenance-report.xlsx', pdf: 'maintenance-report.pdf' },
};

export const reportsApi = {
  download: async (type: ReportType, format: ReportFormat): Promise<void> => {
    const url = `/api/reports/${type}/${format}`;
    const blob = await fetchAuthenticatedBlob(url);
    const filename = FILENAMES[type][format];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },
};
