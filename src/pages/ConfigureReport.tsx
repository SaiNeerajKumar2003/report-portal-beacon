
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
import { reportsStore } from '@/stores/reportsStore';

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
    coreDatasetId: '',
    reportDatasetId: '',
    allowExport: true,
    allowPrint: true,
    accessUsers: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!reportId;

  useEffect(() => {
    if (isEditing && reportId) {
      const existingReport = reportsStore.getReport(reportId);
      if (existingReport) {
        setFormData({
          name: existingReport.name,
          description: existingReport.description,
          category: existingReport.category,
          clientId: existingReport.clientId,
          reportId: existingReport.reportId,
          embedUrl: existingReport.embedUrl,
          tenantId: existingReport.tenantId,
          embedToken: existingReport.embedToken,
          coreDatasetId: existingReport.coreDatasetId || '',
          reportDatasetId: existingReport.reportDatasetId || '',
          allowExport: existingReport.allowExport,
          allowPrint: existingReport.allowPrint,
          accessUsers: existingReport.accessUsers
        });
      }
    }
  }, [isEditing, reportId]);

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
    if (!formData.name || !formData.clientId || !formData.reportId || !formData.tenantId || !formData.coreDatasetId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Client ID, Report ID, Tenant ID, and Core Dataset ID)",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportData = {
        id: reportId || `report-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        clientId: formData.clientId,
        reportId: formData.reportId,
        embedUrl: formData.embedUrl,
        tenantId: formData.tenantId,
        embedToken: formData.embedToken,
        coreDatasetId: formData.coreDatasetId,
        reportDatasetId: formData.reportDatasetId,
        allowExport: formData.allowExport,
        allowPrint: formData.allowPrint,
        accessUsers: formData.accessUsers,
        isActive: true,
        lastUpdated: new Date().toLocaleString()
      };

      reportsStore.saveReport(reportData);
      
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
