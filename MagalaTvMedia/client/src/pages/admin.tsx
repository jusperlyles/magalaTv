import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Image, Video, Users, MessageSquare, Settings } from "lucide-react";
import ArticleManager from "@/components/admin/article-manager";
import MediaManager from "@/components/admin/media-manager";
import CategoryManager from "@/components/admin/category-manager";
import UserManager from "@/components/admin/user-manager";
import CommentManager from "@/components/admin/comment-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import { useArticles, useFeaturedArticles, useBreakingNews } from "@/hooks/useArticles";
import { useTopComments } from "@/hooks/useComments";
import { useQuery } from "@tanstack/react-query";
import type { CategoryWithColor } from "@/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch data for dashboard overview
  const { data: articles } = useArticles(5);
  const { data: featuredArticles } = useFeaturedArticles(3);
  const { data: breakingNews } = useBreakingNews();
  const { data: topComments } = useTopComments(5);
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Promise<CategoryWithColor[]>;
    },
  });

  const stats = {
    totalArticles: articles?.length || 0,
    featuredArticles: featuredArticles?.length || 0,
    breakingNews: breakingNews?.length || 0,
    totalComments: topComments?.length || 0,
    totalCategories: categories?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Magala Media House Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalyticsDashboard stats={stats} />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="comments">
            <CommentManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}