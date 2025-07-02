import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, User, Eye, Share2, Heart, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLikeArticle } from "@/hooks/useArticles";
import { useCreateComment } from "@/hooks/useComments";
import { useToast } from "@/hooks/use-toast";
import type { ArticleWithDetails } from "@/types";

interface ArticleCardProps {
  article: ArticleWithDetails;
  user?: { id: number; email: string; firstName?: string; lastName?: string } | null;
  onCardClick?: (article: ArticleWithDetails) => void;
}

export default function ArticleCard({ article, user, onCardClick }: ArticleCardProps) {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  
  const likeArticle = useLikeArticle();
  const createComment = useCreateComment();

  const timeAgo = article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : "Recently";

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    likeArticle.mutate(article.id, {
      onSuccess: () => {
        setIsLiked(!isLiked);
        toast({
          title: "Success",
          description: isLiked ? "Article unliked!" : "Article liked!",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to like article. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) return;

    createComment.mutate({
      content: newComment,
      articleId: article.id,
      authorId: user.id,
    }, {
      onSuccess: () => {
        setNewComment("");
        toast({
          title: "Success",
          description: "Comment added!",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const url = `${window.location.origin}/article/${article.slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || "",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(article);
    }
  };

  if (article.videoUrl) {
    return (
      <div className="article-card group animate-fade-in-up">
        <div className="video-container relative overflow-hidden">
          <iframe
            src={article.videoUrl}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
            title={article.title}
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white border-0 shadow-lg">
              <i className="fas fa-play mr-1"></i>
              VIDEO
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          {/* Category and Breaking Badge */}
          <div className="flex items-center justify-between mb-3">
            {article.category && (
              <Badge 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-sm"
              >
                <Tag className="w-3 h-3 mr-1" />
                {article.category.name.toUpperCase()}
              </Badge>
            )}
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white border-0 shadow-sm animate-pulse">
                🚨 BREAKING
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {article.title}
          </h3>
          
          {article.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
          )}
          
          {/* Author and Time */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">
                {article.author?.firstName || article.author?.username || 'Anonymous'}
                {article.author?.lastName && ` ${article.author.lastName}`}
              </span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-card group animate-fade-in-up cursor-pointer" onClick={handleCardClick}>
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img
          src={article.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={article.title}
          className="article-image w-full h-full object-cover"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {article.category && (
            <Badge 
              className="bg-white/90 text-gray-800 border-0 shadow-lg backdrop-blur-sm"
            >
              <Tag className="w-3 h-3 mr-1" />
              {article.category.name.toUpperCase()}
            </Badge>
          )}
          {article.isBreaking && (
            <Badge className="bg-red-600 text-white border-0 shadow-lg animate-pulse">
              🚨 BREAKING
            </Badge>
          )}
          {article.isFeatured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-lg">
              ⭐ FEATURED
            </Badge>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {article.title}
        </h3>
        
        {article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
        )}
        
        {/* Author and Time */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">
              {article.author?.firstName || article.author?.username || 'Anonymous'}
              {article.author?.lastName && ` ${article.author.lastName}`}
            </span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        {/* Enhanced Interaction Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-sm p-2 h-auto transition-all duration-300 rounded-full ${
                isLiked 
                  ? "text-red-600 bg-red-50 hover:bg-red-100" 
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
              disabled={likeArticle.isPending}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{(article.likeCount || 0) + (isLiked ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="text-sm p-2 h-auto text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="font-medium">{article.commentCount || 0}</span>
            </Button>
            
            <div className="flex items-center text-gray-500 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              <span className="font-medium">{article.viewCount || 0}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-sm p-2 h-auto text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-full"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Comment Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
            <form onSubmit={handleAddComment} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-sm py-2 px-4 bg-gray-50 border-0 rounded-full focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all duration-300"
                disabled={createComment.isPending}
              />
              {newComment.trim() && (
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition-all duration-300"
                  disabled={createComment.isPending}
                >
                  {createComment.isPending ? "..." : "Post"}
                </Button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}