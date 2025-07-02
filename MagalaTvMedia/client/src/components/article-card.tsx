import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, User, Eye, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden article-card">
        <div className="video-container">
          <iframe
            src={article.videoUrl}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
            title={article.title}
          />
        </div>
        <div className="p-4">
          {article.category && (
            <span className={`text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded`}>
              {article.category.name.toUpperCase()}
            </span>
          )}
          <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
          {article.excerpt && (
            <p className="text-gray-600 text-sm mt-2">{article.excerpt}</p>
          )}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>
              By {article.author?.firstName || article.author?.username || 'Anonymous'}
              {article.author?.lastName && ` ${article.author.lastName}`}
            </span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden article-card">
      <img
        src={article.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        {article.category && (
          <span className={`text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded`}>
            {article.category.name.toUpperCase()}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
        {article.excerpt && (
          <p className="text-gray-600 text-sm mt-2">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>
            By {article.author?.firstName || article.author?.username || 'Anonymous'}
            {article.author?.lastName && ` ${article.author.lastName}`}
          </span>
          <span>{timeAgo}</span>
        </div>
        
        {/* Enhanced Interaction Bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-xs p-1 h-auto transition-colors ${
                isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
              }`}
              disabled={likeArticle.isPending}
            >
              <Heart className={`w-3 h-3 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {(article.likeCount || 0) + (isLiked ? 1 : 0)}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-xs p-1 h-auto text-gray-500 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {article.commentCount || 0}
            </Button>
            
            <div className="flex items-center text-gray-500">
              <Eye className="w-3 h-3 mr-1" />
              <span className="text-xs">{article.viewCount || 0}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-xs p-1 h-auto text-gray-500 hover:text-green-600 transition-colors"
          >
            <Share2 className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <form onSubmit={handleAddComment} className="flex items-center mb-2">
            <User className="w-6 h-6 mr-2 text-gray-400" />
            <Input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm py-1 px-2 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-300"
              disabled={createComment.isPending}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
