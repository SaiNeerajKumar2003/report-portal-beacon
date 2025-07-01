
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Maximize2, Download, Printer, RefreshCw } from 'lucide-react';
import PowerBIEmbed from '@/components/powerbi/PowerBIEmbed';
import { reportsStore, ReportConfig } from '@/stores/reportsStore';

const ReportView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reportData, setReportData] = useState<ReportConfig | null>(null);

  useEffect(() => {
    if (reportId) {
      const report = reportsStore.getReport(reportId);
      setReportData(report || null);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [reportId]);

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleExport = () => {
    console.log('Exporting report...');
    // In real implementation, this would trigger Power BI export
  };

  const handlePrint = () => {
    console.log('Printing report...');
    window.print();
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!reportData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
            <p className="text-gray-600 mb-4">The requested report could not be found.</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{reportData.name}</h1>
                <Badge variant="outline">{reportData.category}</Badge>
              </div>
              <p className="text-gray-600">{reportData.description}</p>
              <p className="text-sm text-gray-500">Last updated: {reportData.lastUpdated}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {reportData.allowExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
            {reportData.allowPrint && (
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4 mr-1" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Report Container */}
        <Card className={isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
          <CardContent className={`p-0 ${isFullscreen ? 'h-full' : 'h-[800px]'}`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading report...</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white rounded-lg border overflow-hidden">
                <PowerBIEmbed
                  reportId={reportData.reportId}
                  clientId={reportData.clientId}
                  embedUrl={reportData.embedUrl}
                  tenantId={reportData.tenantId}
                  embedToken={reportData.embedToken}
                  className="h-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportView;
