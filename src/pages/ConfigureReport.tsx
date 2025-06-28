
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConfigureReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    clientId: '',
    reportId: '',
    embedUrl: '',
    allowExport: true,
    allowPrint: true,
    accessUsers: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!reportId;

  useEffect(() => {
    if (isEditing) {
      // Mock loading existing report data
      setFormData({
        name: 'Sales Performance Dashboard',
        description: 'Monthly sales performance metrics and KPIs',
        category: 'Sales',
        clientId: '12345678-1234-1234-1234-123456789012',
        reportId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv',
        embedUrl: 'https://app.powerbi.com/embed/report/sample-report-id',
        allowExport: true,
        allowPrint: true,
        accessUsers: ['user1', 'user2']
      });
    }
  }, [isEditing]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.name || !formData.clientId || !formData.reportId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Client ID, Report ID)",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isEditing ? "Report Updated" : "Report Created",
        description: `Report "${formData.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Report' : 'Configure New Report'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update report configuration' : 'Add a new Power BI report to the portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Configure the Power BI report settings and access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter report name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter report description"
                  rows={3}
                />
              </div>

              {/* Power BI Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Power BI Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID *</Label>
                    <Input
                      id="clientId"
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
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
                      onChange={(e) => handleInputChange('reportId', e.target.value)}
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
                    onChange={(e) => handleInputChange('embedUrl', e.target.value)}
                    placeholder="https://app.powerbi.com/embed/report/..."
                  />
                  <p className="text-xs text-gray-500">
                    Optional: Direct embed URL (will be generated if not provided)
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Report Permissions</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Export</Label>
                    <p className="text-sm text-gray-500">Users can export report data</p>
                  </div>
                  <Switch
                    checked={formData.allowExport}
                    onCheckedChange={(checked) => handleInputChange('allowExport', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Print</Label>
                    <p className="text-sm text-gray-500">Users can print the report</p>
                  </div>
                  <Switch
                    checked={formData.allowPrint}
                    onCheckedChange={(checked) => handleInputChange('allowPrint', checked)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Update Report' : 'Create Report'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfigureReport;
