
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Save, ArrowLeft, Upload } from 'lucide-react';

const ConfigureReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!reportId;

  const [reportConfig, setReportConfig] = useState({
    name: isEditMode ? 'Sales Performance Dashboard' : '',
    description: isEditMode ? 'Monthly sales performance metrics and KPIs' : '',
    category: isEditMode ? 'Sales' : '',
    isActive: isEditMode ? true : false,
    powerBIUrl: isEditMode ? 'https://app.powerbi.com/embed/report/sample-report-id' : '',
    accessUsers: isEditMode ? ['user1', 'user2'] : [],
    refreshInterval: isEditMode ? '60' : '30',
    allowExport: isEditMode ? true : false,
    allowPrint: isEditMode ? true : false
  });

  const availableUsers = [
    { id: 'user1', name: 'John Doe', email: 'john@company.com' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@company.com' },
    { id: 'user3', name: 'Bob Johnson', email: 'bob@company.com' }
  ];

  const handleUserAccessChange = (userId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      accessUsers: checked 
        ? [...prev.accessUsers, userId]
        : prev.accessUsers.filter(id => id !== userId)
    }));
  };

  const handleSave = () => {
    if (!reportConfig.name || !reportConfig.powerBIUrl) {
      toast({
        title: "Validation Error",
        description: "Report name and Power BI URL are required",
        variant: "destructive"
      });
      return;
    }

    console.log('Saving report config:', reportConfig);
    
    toast({
      title: "Success",
      description: isEditMode ? "Report configuration updated successfully" : "New report created successfully"
    });

    navigate('/admin/dashboard');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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
              {isEditMode ? 'Edit Report Configuration' : 'Create New Report'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Modify the report settings and access permissions' : 'Configure your Power BI report settings'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure the basic report details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig({...reportConfig, name: e.target.value})}
                    placeholder="Enter report name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig({...reportConfig, description: e.target.value})}
                    placeholder="Enter report description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={reportConfig.category}
                    onChange={(e) => setReportConfig({...reportConfig, category: e.target.value})}
                    placeholder="e.g., Sales, Marketing, Finance"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Power BI Configuration</CardTitle>
                <CardDescription>Configure Power BI report embedding settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="powerbi-url">Power BI Embed URL *</Label>
                  <Input
                    id="powerbi-url"
                    value={reportConfig.powerBIUrl}
                    onChange={(e) => setReportConfig({...reportConfig, powerBIUrl: e.target.value})}
                    placeholder="https://app.powerbi.com/embed/report/..."
                  />
                  <p className="text-xs text-gray-500">
                    Get this URL from Power BI Service → Report → File → Embed Report
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Auto-refresh Interval (minutes)</Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    value={reportConfig.refreshInterval}
                    onChange={(e) => setReportConfig({...reportConfig, refreshInterval: e.target.value})}
                    placeholder="30"
                    min="1"
                    max="1440"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-export"
                      checked={reportConfig.allowExport}
                      onCheckedChange={(checked) => setReportConfig({...reportConfig, allowExport: checked})}
                    />
                    <Label htmlFor="allow-export">Allow Export</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-print"
                      checked={reportConfig.allowPrint}
                      onCheckedChange={(checked) => setReportConfig({...reportConfig, allowPrint: checked})}
                    />
                    <Label htmlFor="allow-print">Allow Print</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={reportConfig.isActive}
                    onCheckedChange={(checked) => setReportConfig({...reportConfig, isActive: checked})}
                  />
                  <Label htmlFor="is-active">
                    {reportConfig.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reportConfig.isActive 
                    ? 'Report is visible to assigned users' 
                    : 'Report is hidden from users'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Access</CardTitle>
                <CardDescription>Select users who can access this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={user.id}
                        checked={reportConfig.accessUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleUserAccessChange(user.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={user.id} className="text-sm font-medium">
                          {user.name}
                        </Label>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleSave} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update Report' : 'Create Report'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfigureReport;
