
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Plus, Settings, Eye, BarChart3, Users, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reportsStore, ReportConfig } from '@/stores/reportsStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportConfig[]>([]);

  useEffect(() => {
    // Load reports from store
    setReports(reportsStore.getAllReports());
  }, []);

  const handleStatusToggle = (reportId: string, newStatus: 'active' | 'inactive') => {
    reportsStore.updateReport(reportId, { 
      // Note: We're not storing status in our current interface, but we can extend it
      lastUpdated: new Date().toLocaleString()
    });
    
    // Update local state
    setReports(reportsStore.getAllReports());
    
    const report = reports.find(r => r.id === reportId);
    toast({
      title: "Report Status Updated",
      description: `${report?.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
    });
  };

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length.toString(),
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Active Reports',
      value: reports.length.toString(), // All reports are considered active for now
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: '3',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.username}</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/configure')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Management */}
        <Card>
          <CardHeader>
            <CardTitle>Reports Management</CardTitle>
            <CardDescription>
              Manage all BI reports and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <Badge variant="default">
                        active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Last modified: {report.lastUpdated}</span>
                      <span>Users with access: {report.accessUsers.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Active
                      </span>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => 
                          handleStatusToggle(report.id, checked ? 'active' : 'inactive')
                        }
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/report/${report.id}`)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/configure/${report.id}`)}
                      >
                        <Settings className="mr-1 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
