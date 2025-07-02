import { useState } from "react";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLikeArticle } from "@/hooks/useArticles";
import { useComments, useCreateComment, useLikeComment } from "@/hooks/useComments";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { ArticleWithDetails, CommentWithDetails } from "@/types";

interface ArticleInteractionsProps {
  article: ArticleWithDetails;
  user?: { id: number; email: string; firstName?: string; lastName?: string } | null;
}

export default function ArticleInteractions({ article, user }: ArticleInteractionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { toast } = useToast();
  const likeArticleMutation = useLikeArticle();
  const { data: comments, isLoading: commentsLoading } = useComments(article.id);
  const createCommentMutation = useCreateComment();
  const likeCommentMutation = useLikeComment();

  const handleLikeArticle = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    likeArticleMutation.mutate(article.id);
  };

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      content: newComment,
      articleId: article.id,
      authorId: user.id,
    }, {
      onSuccess: () => {
        setNewComment("");
        toast({
          title: "Comment posted",
          description: "Your comment has been added successfully",
        });
      }
    });
  };

  const handleSubmitReply = (parentId: number) => {
    if (!user || !replyText.trim()) return;

    createCommentMutation.mutate({
      content: replyText,
      articleId: article.id,
      authorId: user.id,
      parentId,
    }, {
      onSuccess: () => {
        setReplyText("");
        setReplyingTo(null);
        toast({
          title: "Reply posted",
          description: "Your reply has been added successfully",
        });
      }
    });
  };

  const handleLikeComment = (commentId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }

    likeCommentMutation.mutate(commentId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Article Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeArticle}
                className="flex items-center space-x-2 hover:text-red-600"
                disabled={likeArticleMutation.isPending}
              >
                <Heart className="h-4 w-4" />
                <span>{article.likeCount || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{comments?.length || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 hover:text-green-600"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {article.viewCount || 0} views
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      {showComments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Comments ({comments?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            {user ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || createCommentMutation.isPending}
                        size="sm"
                      >
                        {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Please sign in to leave a comment</p>
              </div>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    user={user}
                    onLike={handleLikeComment}
                    onReply={(commentId) => setReplyingTo(commentId)}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSubmitReply={handleSubmitReply}
                    onCancelReply={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: CommentWithDetails;
  user?: { id: number; email: string; firstName?: string; lastName?: string } | null;
  onLike: (commentId: number) => void;
  onReply: (commentId: number) => void;
  replyingTo: number | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: (parentId: number) => void;
  onCancelReply: () => void;
}

function CommentItem({
  comment,
  user,
  onLike,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply
}: CommentItemProps) {
  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "Recently";

  const authorName = comment.author
    ? `${comment.author.firstName || ""} ${comment.author.lastName || ""}`.trim() ||
      comment.author.username ||
      comment.author.email?.split("@")[0]
    : "Anonymous";

  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{authorName}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="text-gray-700 text-sm">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id)}
            className="h-6 px-2 text-xs hover:text-red-600"
          >
            <Heart className="h-3 w-3 mr-1" />
            {comment.likeCount || 0}
          </Button>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="h-6 px-2 text-xs hover:text-blue-600"
            >
              Reply
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelReply}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => onSubmitReply(comment.id)}
                disabled={!replyText.trim()}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}