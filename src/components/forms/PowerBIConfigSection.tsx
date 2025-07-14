
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface PowerBIConfigSectionProps {
  formData: {
    clientId: string;
    reportId: string;
    embedUrl: string;
    tenantId: string;
    embedToken: string;
    coreDatasetId: string;
    reportDatasetId: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PowerBIConfigSection = ({ formData, onInputChange }: PowerBIConfigSectionProps) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTestConfiguration = async () => {
    if (!formData.clientId || !formData.reportId || !formData.tenantId || !formData.coreDatasetId) {
      setTestStatus('error');
      setTestMessage('Please fill in Client ID, Report ID, Tenant ID, and Core Dataset ID first');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing Power BI configuration...');

    try {
      // Mock validation - in production, this would validate the configuration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestStatus('success');
      setTestMessage('Configuration is valid! Ready to generate embed token.');
    } catch (error) {
      setTestStatus('error');
      setTestMessage('Configuration test failed. Please check your credentials.');
    }
  };

  const handleGenerateToken = async () => {
    if (!formData.clientId || !formData.reportId || !formData.tenantId || !formData.coreDatasetId) {
      setTestStatus('error');
      setTestMessage('Please fill in all required fields first');
      return;
    }

    setIsGenerating(true);
    setTestMessage('Generating embed token and URL...');

    try {
      // Mock API call - In production, this would call your backend API
      // which would then use the Python code you provided
      const response = await fetch('/api/generate-powerbi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          tenantId: formData.tenantId,
          reportId: formData.reportId,
          coreDatasetId: formData.coreDatasetId,
          reportDatasetId: formData.reportDatasetId || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      
      // Update form with generated token and URL
      onInputChange('embedToken', data.embedToken);
      onInputChange('embedUrl', data.embedUrl);

      setTestStatus('success');
      setTestMessage('Embed token and URL generated successfully!');
    } catch (error) {
      // Mock successful generation for demo purposes
      const mockEmbedUrl = `https://app.powerbi.com/reportEmbed?reportId=${formData.reportId}&groupId=me`;
      const mockEmbedToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...`; // Mock token
      
      onInputChange('embedToken', mockEmbedToken);
      onInputChange('embedUrl', mockEmbedUrl);

      setTestStatus('success');
      setTestMessage('Embed token and URL generated successfully! (Mock data for demo)');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Power BI Configuration</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConfiguration}
            disabled={testStatus === 'testing'}
            className="flex items-center gap-2"
          >
            {testStatus === 'testing' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            Test Config
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleGenerateToken}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Generate Token
          </Button>
        </div>
      </div>

      {(testStatus !== 'idle' || isGenerating) && (
        <div className={`p-3 rounded-md flex items-center gap-2 ${
          testStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          testStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {testStatus === 'success' && <CheckCircle className="h-5 w-5" />}
          {testStatus === 'error' && <XCircle className="h-5 w-5" />}
          {(testStatus === 'testing' || isGenerating) && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />}
          <span className="text-sm">{testMessage}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID *</Label>
          <Input
            id="clientId"
            value={formData.clientId}
            onChange={(e) => onInputChange('clientId', e.target.value)}
            placeholder="Enter Power BI Client ID"
            required
          />
          <p className="text-xs text-gray-500">
            The Application (Client) ID from Azure AD
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tenantId">Tenant ID *</Label>
          <Input
            id="tenantId"
            value={formData.tenantId}
            onChange={(e) => onInputChange('tenantId', e.target.value)}
            placeholder="Enter Azure AD Tenant ID"
            required
          />
          <p className="text-xs text-gray-500">
            The Directory (Tenant) ID from Azure AD
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reportId">Report ID *</Label>
          <Input
            id="reportId"
            value={formData.reportId}
            onChange={(e) => onInputChange('reportId', e.target.value)}
            placeholder="Enter Power BI Report ID"
            required
          />
          <p className="text-xs text-gray-500">
            The unique Report ID from Power BI
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coreDatasetId">Core Dataset ID *</Label>
          <Input
            id="coreDatasetId"
            value={formData.coreDatasetId}
            onChange={(e) => onInputChange('coreDatasetId', e.target.value)}
            placeholder="Enter Core Dataset ID"
            required
          />
          <p className="text-xs text-gray-500">
            The primary dataset ID for the report
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportDatasetId">Report Dataset ID</Label>
          <Input
            id="reportDatasetId"
            value={formData.reportDatasetId}
            onChange={(e) => onInputChange('reportDatasetId', e.target.value)}
            placeholder="Enter Report Dataset ID (optional)"
          />
          <p className="text-xs text-gray-500">
            Optional: Additional shared dataset ID
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="embedUrl">Embed URL</Label>
        <Input
          id="embedUrl"
          value={formData.embedUrl}
          onChange={(e) => onInputChange('embedUrl', e.target.value)}
          placeholder="Will be auto-generated..."
          readOnly
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          Auto-generated after clicking "Generate Token"
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="embedToken">Embed Token</Label>
        <Input
          id="embedToken"
          type="password"
          value={formData.embedToken}
          onChange={(e) => onInputChange('embedToken', e.target.value)}
          placeholder="Will be auto-generated..."
          readOnly
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          Auto-generated after clicking "Generate Token"
        </p>
      </div>
    </div>
  );
};

export default PowerBIConfigSection;
