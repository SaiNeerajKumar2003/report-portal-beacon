
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Plus, Settings, Eye, BarChart3, Users, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastModified: string;
  accessUsers: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'report1',
      name: 'Sales Performance Dashboard',
      description: 'Monthly sales performance metrics and KPIs',
      status: 'active',
      lastModified: '2024-06-25',
      accessUsers: ['user1', 'user2']
    },
    {
      id: 'report2',
      name: 'Customer Analytics Report',
      description: 'Customer behavior and segmentation analysis',
      status: 'active',
      lastModified: '2024-06-20',
      accessUsers: ['user1']
    },
    {
      id: 'report3',
      name: 'Financial Summary',
      description: 'Quarterly financial performance overview',
      status: 'inactive',
      lastModified: '2024-06-15',
      accessUsers: ['user2']
    }
  ]);

  const handleStatusToggle = (reportId: string, newStatus: 'active' | 'inactive') => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
          : report
      )
    );
    
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
      value: reports.filter(r => r.status === 'active').length.toString(),
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
                      <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Last modified: {report.lastModified}</span>
                      <span>Users with access: {report.accessUsers.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {report.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <Switch
                        checked={report.status === 'active'}
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
