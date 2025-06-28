
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PermissionsSectionProps {
  formData: {
    allowExport: boolean;
    allowPrint: boolean;
  };
  onInputChange: (field: string, value: boolean) => void;
}

const PermissionsSection = ({ formData, onInputChange }: PermissionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Report Permissions</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Allow Export</Label>
          <p className="text-sm text-gray-500">Users can export report data</p>
        </div>
        <Switch
          checked={formData.allowExport}
          onCheckedChange={(checked) => onInputChange('allowExport', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Allow Print</Label>
          <p className="text-sm text-gray-500">Users can print the report</p>
        </div>
        <Switch
          checked={formData.allowPrint}
          onCheckedChange={(checked) => onInputChange('allowPrint', checked)}
        />
      </div>
    </div>
  );
};

export default PermissionsSection;
