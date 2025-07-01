import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Maximize2, Download, Printer, RefreshCw } from 'lucide-react';
import PowerBIEmbed from '@/components/powerbi/PowerBIEmbed';

const ReportView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock report data with actual Power BI configuration
  const reportData = {
    id: reportId,
    name: 'Sales Performance Dashboard',
    description: 'Monthly sales performance metrics and KPIs',
    category: 'Sales',
    clientId: '12345678-1234-1234-1234-123456789012',
    reportId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=abcd1234-5678-90ef-ghij-klmnopqrstuv&groupId=me',
    tenantId: '87654321-4321-4321-4321-210987654321',
    lastUpdated: '2024-06-26 10:30 AM',
    allowExport: true,
    allowPrint: true,
    // In production, this would come from your secure backend
    embedToken: null // Set to null to show the authentication required message
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
