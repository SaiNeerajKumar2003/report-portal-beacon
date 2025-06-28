
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PowerBIConfigSectionProps {
  formData: {
    clientId: string;
    reportId: string;
    embedUrl: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PowerBIConfigSection = ({ formData, onInputChange }: PowerBIConfigSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Power BI Configuration</h3>
      
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="embedUrl">Embed URL</Label>
        <Input
          id="embedUrl"
          value={formData.embedUrl}
          onChange={(e) => onInputChange('embedUrl', e.target.value)}
          placeholder="https://app.powerbi.com/embed/report/..."
        />
        <p className="text-xs text-gray-500">
          Optional: Direct embed URL (will be generated if not provided)
        </p>
      </div>
    </div>
  );
};

export default PowerBIConfigSection;
