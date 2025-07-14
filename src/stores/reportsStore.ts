interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  clientId: string;
  reportId: string;
  embedUrl: string;
  tenantId: string;
  embedToken: string;
  coreDatasetId: string;
  reportDatasetId?: string;
  allowExport: boolean;
  allowPrint: boolean;
  accessUsers: string[];
  isActive: boolean;
  lastUpdated: string;
}

class ReportsStore {
  private reports: Map<string, ReportConfig> = new Map();
  private readonly STORAGE_KEY = 'powerbi_reports';

  constructor() {
    this.loadFromStorage();
    
    // Initialize with default data only if no reports exist
    if (this.reports.size === 0) {
      this.reports.set('report1', {
        id: 'report1',
        name: 'Sales Performance Dashboard',
        description: 'Monthly sales performance metrics and KPIs',
        category: 'Sales',
        clientId: '12345678-1234-1234-1234-123456789012',
        reportId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv',
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=abcd1234-5678-90ef-ghij-klmnopqrstuv&groupId=me',
        tenantId: '87654321-4321-4321-4321-210987654321',
        embedToken: '',
        coreDatasetId: '1b112bf5-8e80-40a4-9c24-ff80458a1759',
        reportDatasetId: '041e5091-1c88-49f0-b825-cf6b91f84a60',
        allowExport: true,
        allowPrint: true,
        accessUsers: ['user1', 'user2'],
        isActive: true,
        lastUpdated: '2024-06-26 10:30 AM'
      });
      this.saveToStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const reportsArray: ReportConfig[] = JSON.parse(stored);
        this.reports.clear();
        reportsArray.forEach(report => {
          this.reports.set(report.id, report);
        });
        console.log('Loaded reports from localStorage:', reportsArray.length);
      }
    } catch (error) {
      console.error('Error loading reports from localStorage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const reportsArray = Array.from(this.reports.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reportsArray));
      console.log('Saved reports to localStorage:', reportsArray.length);
    } catch (error) {
      console.error('Error saving reports to localStorage:', error);
    }
  }

  getReport(id: string): ReportConfig | undefined {
    return this.reports.get(id);
  }

  saveReport(report: ReportConfig): void {
    report.lastUpdated = new Date().toLocaleString();
    this.reports.set(report.id, report);
    this.saveToStorage();
  }

  getAllReports(): ReportConfig[] {
    return Array.from(this.reports.values());
  }

  updateReport(id: string, updates: Partial<ReportConfig>): void {
    const existing = this.reports.get(id);
    if (existing) {
      const updated = { ...existing, ...updates, lastUpdated: new Date().toLocaleString() };
      this.reports.set(id, updated);
      this.saveToStorage();
    }
  }

  toggleReportStatus(id: string): boolean {
    const existing = this.reports.get(id);
    if (existing) {
      const updated = { ...existing, isActive: !existing.isActive, lastUpdated: new Date().toLocaleString() };
      this.reports.set(id, updated);
      this.saveToStorage();
      return updated.isActive;
    }
    return false;
  }

  deleteReport(id: string): boolean {
    const deleted = this.reports.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
}

export const reportsStore = new ReportsStore();
export type { ReportConfig };
