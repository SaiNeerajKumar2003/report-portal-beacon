
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import BasicInfoSection from '@/components/forms/BasicInfoSection';
import PowerBIConfigSection from '@/components/forms/PowerBIConfigSection';
import PermissionsSection from '@/components/forms/PermissionsSection';
import FormHeader from '@/components/forms/FormHeader';
import FormActions from '@/components/forms/FormActions';

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
    tenantId: '',
    embedToken: '',
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
        tenantId: '87654321-4321-4321-4321-210987654321',
        embedToken: '',
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
    if (!formData.name || !formData.clientId || !formData.reportId || !formData.tenantId || !formData.embedToken) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Client ID, Report ID, Tenant ID, and Embed Token)",
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

  const handleBackClick = () => navigate('/admin/dashboard');
  const handleCancelClick = () => navigate('/admin/dashboard');

  return (
    <Layout>
      <div className="space-y-6">
        <FormHeader isEditing={isEditing} onBackClick={handleBackClick} />

        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Configure the Power BI report settings and access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoSection 
                formData={formData} 
                onInputChange={handleInputChange} 
              />
              
              <PowerBIConfigSection 
                formData={formData} 
                onInputChange={handleInputChange} 
              />
              
              <PermissionsSection 
                formData={formData} 
                onInputChange={handleInputChange} 
              />

              <FormActions 
                isLoading={isLoading}
                isEditing={isEditing}
                onCancel={handleCancelClick}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfigureReport;
