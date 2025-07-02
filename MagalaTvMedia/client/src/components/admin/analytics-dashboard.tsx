import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Heart, MessageCircle, Folder, TrendingUp } from "lucide-react";

interface AnalyticsDashboardProps {
  stats: {
    totalArticles: number;
    featuredArticles: number;
    breakingNews: number;
    totalComments: number;
    totalCategories: number;
  };
}

export default function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const quickStats = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Featured Articles",
      value: stats.featuredArticles,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Breaking News",
      value: stats.breakingNews,
      icon: Eye,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Folder,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Create New Article</span>
                <Badge variant="secondary">Click Articles Tab</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Upload Media</span>
                <Badge variant="secondary">Click Media Tab</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Manage Categories</span>
                <Badge variant="secondary">Click Categories Tab</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Review Comments</span>
                <Badge variant="secondary">Click Comments Tab</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Database Connection</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">API Status</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Media Storage</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">User Sessions</span>
                <Badge className="bg-blue-100 text-blue-800">1 Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Magala Media Admin Panel
            </h3>
            <p className="text-gray-600 mb-4">
              Manage your news content, upload media, organize categories, and monitor user engagement all from this dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                All Systems Operational
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Ready for Content Management
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}