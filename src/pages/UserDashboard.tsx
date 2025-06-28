
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Eye, BarChart3, Clock, TrendingUp } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  lastViewed?: string;
  category: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock reports data - filtered by user access
  const [reports] = useState<Report[]>([
    {
      id: 'report1',
      name: 'Sales Performance Dashboard',
      description: 'Monthly sales performance metrics and KPIs',
      lastViewed: '2024-06-26',
      category: 'Sales'
    },
    {
      id: 'report2',
      name: 'Customer Analytics Report',
      description: 'Customer behavior and segmentation analysis',
      lastViewed: '2024-06-24',
      category: 'Marketing'
    },
    {
      id: 'report3',
      name: 'Financial Summary',
      description: 'Quarterly financial performance overview',
      category: 'Finance'
    }
  ]);

  // Filter reports based on user access
  const accessibleReports = reports.filter(report => 
    user?.accessibleReports?.includes(report.id)
  );

  const recentReports = accessibleReports
    .filter(report => report.lastViewed)
    .sort((a, b) => new Date(b.lastViewed!).getTime() - new Date(a.lastViewed!).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Reports</p>
                  <p className="text-2xl font-bold">{accessibleReports.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recently Viewed</p>
                  <p className="text-2xl font-bold">{recentReports.length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Reports you've accessed recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <Badge variant="outline">{report.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Last viewed: {report.lastViewed}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/user/report/${report.id}`)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              All reports you have access to view
            </CardDescription>
          </CardHeader>
          <CardContent>
            {accessibleReports.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Contact your administrator to get access to reports.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessibleReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{report.category}</Badge>
                        {report.lastViewed && <Badge variant="secondary">Recent</Badge>}
                      </div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/user/report/${report.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserDashboard;
