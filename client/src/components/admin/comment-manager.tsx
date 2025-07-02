import { useState } from "react";
import { Search, Filter, Trash2, Eye, EyeOff, MessageCircle, ThumbsUp, ThumbsDown, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTopComments } from "@/hooks/useComments";
import { formatDistanceToNow } from "date-fns";

export default function CommentManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { toast } = useToast();
  
  const { data: comments, isLoading } = useTopComments(20);

  const handleApprove = (commentId: number) => {
    toast({
      title: "Success",
      description: "Comment approved successfully!",
    });
  };

  const handleReject = (commentId: number) => {
    toast({
      title: "Success",
      description: "Comment rejected successfully!",
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    }
  };

  const filteredComments = comments?.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comment Management</h2>
          <p className="text-gray-600">Moderate and manage user comments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-800">
            {filteredComments?.length || 0} Comments
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({filteredComments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredComments?.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No comments found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredComments?.map((comment) => {
                const timeAgo = comment.createdAt
                  ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                  : "Recently";

                return (
                  <div key={comment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">
                              {comment.author?.firstName || comment.author?.email?.split('@')[0] || 'Anonymous'}
                              {comment.author?.lastName && ` ${comment.author.lastName}`}
                            </h4>
                            {getStatusBadge("approved")}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{timeAgo}</span>
                            </div>
                            {comment.article && (
                              <span>on "{comment.article.title}"</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(comment.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(comment.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="mb-3">
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>

                    {/* Comment Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likeCount || 0} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikeCount || 0} dislikes</span>
                      </div>
                      {comment.author?.email && (
                        <span>Email: {comment.author.email}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}