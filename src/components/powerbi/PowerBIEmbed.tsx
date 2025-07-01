
import { useEffect, useRef } from 'react';
import { models, Report, service, Embed } from 'powerbi-client';

interface PowerBIEmbedProps {
  reportId: string;
  clientId: string;
  embedUrl: string;
  accessToken?: string;
  className?: string;
}

const PowerBIEmbed = ({ reportId, clientId, embedUrl, accessToken, className = '' }: PowerBIEmbedProps) => {
  const reportContainer = useRef<HTMLDivElement>(null);
  const reportRef = useRef<Report | null>(null);

  useEffect(() => {
    if (!reportContainer.current || !reportId || !embedUrl) return;

    // Power BI embed configuration
    const embedConfig = {
      type: 'report',
      id: reportId,
      embedUrl: embedUrl,
      accessToken: accessToken || '', // In production, this should come from your backend
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: true
          },
          pageNavigation: {
            visible: true
          }
        },
        background: models.BackgroundType.Transparent,
        layoutType: models.LayoutType.Custom,
        contrastMode: models.ContrastMode.None
      }
    };

    try {
      // Embed the report using the service
      const powerbi = new service.Service();

      reportRef.current = powerbi.embed(
        reportContainer.current,
        embedConfig
      ) as Report;

      // Handle events
      reportRef.current.on('loaded', () => {
        console.log('Power BI report loaded successfully');
      });

      reportRef.current.on('error', (event) => {
        console.error('Power BI report error:', event.detail);
      });

    } catch (error) {
      console.error('Error embedding Power BI report:', error);
    }

    // Cleanup function
    return () => {
      if (reportRef.current) {
        try {
          reportRef.current.off('loaded');
          reportRef.current.off('error');
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
      }
    };
  }, [reportId, embedUrl, accessToken, clientId]);

  // If no access token is provided, show a message about authentication
  if (!accessToken) {
    return (
      <div className={`h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <div className="text-center p-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Authentication Required!</strong>
            <span className="block sm:inline"> Power BI access token is needed to display the report.</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Report Configuration:</h3>
            <div className="text-sm text-left space-y-1">
              <p><strong>Report ID:</strong> {reportId}</p>
              <p><strong>Client ID:</strong> {clientId}</p>
              <p><strong>Embed URL:</strong> {embedUrl}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            In production, implement proper authentication to get access tokens from your backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={reportContainer} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default PowerBIEmbed;
