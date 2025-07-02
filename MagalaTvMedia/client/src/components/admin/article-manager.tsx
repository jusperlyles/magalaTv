import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useArticles } from "@/hooks/useArticles";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryWithColor } from "@/types";

export default function ArticleManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    videoUrl: "",
    categoryId: "",
    isFeatured: false,
    isBreaking: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: articles, isLoading } = useArticles(50);
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Promise<CategoryWithColor[]>;
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: any) => {
      return await apiRequest("POST", "/api/articles", {
        ...articleData,
        categoryId: articleData.categoryId ? parseInt(articleData.categoryId) : null,
        slug: articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article created successfully!",
      });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PATCH", `/api/articles/${id}`, {
        ...data,
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article updated successfully!",
      });
      setIsEditModalOpen(false);
      setEditingArticle(null);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      videoUrl: "",
      categoryId: "",
      isFeatured: false,
      isBreaking: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      updateArticleMutation.mutate({ id: editingArticle.id, data: formData });
    } else {
      createArticleMutation.mutate(formData);
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      imageUrl: article.imageUrl || "",
      videoUrl: article.videoUrl || "",
      categoryId: article.categoryId?.toString() || "",
      isFeatured: article.isFeatured || false,
      isBreaking: article.isBreaking || false,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (articleId: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteArticleMutation.mutate(articleId);
    }
  };

  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Article Management</h2>
          <p className="text-gray-600">Create, edit, and manage news articles</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
            </DialogHeader>
            <ArticleForm
              formData={formData}
              setFormData={setFormData}
              categories={categories || []}
              onSubmit={handleSubmit}
              isLoading={createArticleMutation.isPending}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-24 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles?.map((article) => {
                const timeAgo = article.publishedAt
                  ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                  : "Recently";

                return (
                  <div key={article.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=60&fit=crop"}
                      alt={article.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{article.title}</h3>
                        {article.isFeatured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                        {article.isBreaking && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Breaking
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{article.category?.name || "Uncategorized"}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {timeAgo}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.viewCount || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <ArticleForm
            formData={formData}
            setFormData={setFormData}
            categories={categories || []}
            onSubmit={handleSubmit}
            isLoading={updateArticleMutation.isPending}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingArticle(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Article Form Component
interface ArticleFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: CategoryWithColor[];
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

function ArticleForm({ formData, setFormData, categories, onSubmit, isLoading, onCancel }: ArticleFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter article title"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="videoUrl">Video URL (optional)</Label>
          <Input
            id="videoUrl"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://youtube.com/embed/..."
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief summary of the article"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your article content here..."
            rows={10}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="featured">Featured Article</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="breaking"
            checked={formData.isBreaking}
            onCheckedChange={(checked) => setFormData({ ...formData, isBreaking: checked })}
          />
          <Label htmlFor="breaking">Breaking News</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Article"}
        </Button>
      </div>
    </form>
  );
}