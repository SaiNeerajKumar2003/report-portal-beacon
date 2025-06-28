
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Maximize2, Download, Printer, RefreshCw } from 'lucide-react';

const ReportView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock report data
  const reportData = {
    id: reportId,
    name: 'Sales Performance Dashboard',
    description: 'Monthly sales performance metrics and KPIs',
    category: 'Sales',
    embedUrl: 'https://app.powerbi.com/embed/report/sample-report-id',
    lastUpdated: '2024-06-26 10:30 AM',
    allowExport: true,
    allowPrint: true
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
              <div className="h-full bg-white rounded-lg border">
                {/* Mock Power BI Report Embed */}
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="text-center p-8">
                    <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Power BI Report</h3>
                    <p className="text-gray-600 mb-4">
                      This is where your Power BI report would be embedded.<br />
                      The actual iframe would display your dashboard here.
                    </p>
                    <div className="bg-white p-4 rounded-lg shadow-sm border max-w-md mx-auto">
                      <p className="text-sm text-gray-700 font-mono break-all">
                        {reportData.embedUrl}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      In production, this would be replaced with:<br />
                      &lt;iframe src="{reportData.embedUrl}" /&gt;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportView;
