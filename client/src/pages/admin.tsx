import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Image, Video, Users, MessageSquare, Settings, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();

  // Fetch data for dashboard overview
  const { data: articles } = useArticles(50);
  const { data: featuredArticles } = useFeaturedArticles(10);
  const { data: breakingNews } = useBreakingNews();
  const { data: topComments } = useTopComments(20);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Site</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-600">Magala Media House Content Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Online
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/', '_blank')}
              >
                View Live Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white shadow-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in-up">
            <AnalyticsDashboard stats={stats} />
          </TabsContent>

          <TabsContent value="articles" className="animate-fade-in-up">
            <ArticleManager />
          </TabsContent>

          <TabsContent value="media" className="animate-fade-in-up">
            <MediaManager />
          </TabsContent>

          <TabsContent value="categories" className="animate-fade-in-up">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="comments" className="animate-fade-in-up">
            <CommentManager />
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in-up">
            <UserManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}