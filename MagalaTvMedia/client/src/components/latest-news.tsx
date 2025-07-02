import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLatestArticles } from "@/hooks/useArticles";
import { useTopComments } from "@/hooks/useComments";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LatestNews() {
  const [limit, setLimit] = useState(4);
  const [newComment, setNewComment] = useState("");
  
  const { data: latestNews, isLoading } = useLatestArticles(limit);
  const { data: topComments } = useTopComments(3);

  const loadMore = () => {
    setLimit(prev => prev + 4);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Handle comment submission
    console.log("New comment:", newComment);
    setNewComment("");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-24 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Latest News Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="text-red-600 mr-2" />
            LATEST NEWS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestNews?.map((article) => {
              const timeAgo = article.publishedAt 
                ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                : "Recently";

              return (
                <div key={article.id} className="flex border-b pb-4 group last:border-b-0">
                  <div className="w-24 h-20 flex-shrink-0 mr-4">
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"}
                      alt={article.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-red-600 transition duration-200">
                      <button className="text-left">{article.title}</button>
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {article.category && (
                        <>
                          <span>{article.category.name.toUpperCase()}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <span>
                        By {article.author?.firstName || article.author?.username || 'Anonymous'}
                        {article.author?.lastName && ` ${article.author.lastName}`}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button
            onClick={loadMore}
            variant="outline"
            className="w-full mt-4 font-medium"
          >
            Load More Stories <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Top Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-comments text-blue-600 mr-2"></i>
            TOP COMMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topComments?.map((comment) => {
              const timeAgo = comment.createdAt 
                ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                : "Recently";

              return (
                <div key={comment.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={comment.author?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                      alt={`${comment.author?.firstName || 'User'}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {comment.author?.firstName || comment.author?.username || 'Anonymous'}
                      {comment.author?.lastName && ` ${comment.author.lastName}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                    {comment.article && (
                      <p className="text-xs text-gray-500 mt-1">
                        On: {comment.article.title}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Button variant="ghost" size="sm" className="text-xs p-1 h-auto mr-4">
                        <i className="fas fa-thumbs-up mr-1"></i> {comment.likeCount || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs p-1 h-auto mr-4">
                        <i className="fas fa-thumbs-down mr-1"></i> {comment.dislikeCount || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs p-1 h-auto mr-4">
                        Reply
                      </Button>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Add your comment</h3>
              <form onSubmit={handleCommentSubmit}>
                <Textarea
                  rows={3}
                  placeholder="Write your thoughts here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" type="button" className="mr-2 text-gray-500">
                      <i className="fas fa-image text-xl"></i>
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="mr-2 text-gray-500">
                      <i className="far fa-smile text-xl"></i>
                    </Button>
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
