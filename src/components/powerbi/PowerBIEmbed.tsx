
import { useEffect, useRef } from 'react';
import { models, Report, service, Embed } from 'powerbi-client';

interface PowerBIEmbedProps {
  reportId: string;
  clientId: string;
  embedUrl: string;
  tenantId: string;
  embedToken?: string;
  className?: string;
}

const PowerBIEmbed = ({ reportId, clientId, embedUrl, tenantId, embedToken, className = '' }: PowerBIEmbedProps) => {
  const reportContainer = useRef<HTMLDivElement>(null);
  const reportRef = useRef<Report | null>(null);

  useEffect(() => {
    if (!reportContainer.current || !reportId || !embedUrl || !embedToken) return;

    // Power BI embed configuration
    const embedConfig = {
      type: 'report',
      id: reportId,
      embedUrl: embedUrl,
      accessToken: embedToken,
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
      // Use the global powerbi service
      const powerbi = window.powerbi;
      if (!powerbi) {
        console.error('Power BI JavaScript SDK not loaded');
        return;
      }

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
  }, [reportId, embedUrl, embedToken, clientId, tenantId]);

  // If no embed token is provided, show a message about authentication
  if (!embedToken) {
    return (
      <div className={`h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <div className="text-center p-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Authentication Required!</strong>
            <span className="block sm:inline"> Power BI embed token is needed to display the report.</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Report Configuration:</h3>
            <div className="text-sm text-left space-y-1">
              <p><strong>Report ID:</strong> {reportId}</p>
              <p><strong>Client ID:</strong> {clientId}</p>
              <p><strong>Tenant ID:</strong> {tenantId}</p>
              <p><strong>Embed URL:</strong> {embedUrl}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            In production, implement proper authentication to get embed tokens from your backend.
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
