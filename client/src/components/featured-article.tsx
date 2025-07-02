import { formatDistanceToNow } from "date-fns";
import { MessageCircle, User, Clock, Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ArticleWithDetails } from "@/types";

interface FeaturedArticleProps {
  article: ArticleWithDetails;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const timeAgo = article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : "Recently";

  return (
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8 group animate-fade-in-up">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={article.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white border-0 shadow-lg animate-pulse text-sm px-3 py-1">
                🚨 BREAKING NEWS
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-lg text-sm px-3 py-1">
              ⭐ FEATURED
            </Badge>
            {article.category && (
              <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm px-3 py-1">
                {article.category.name.toUpperCase()}
              </Badge>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h2>
          
          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-gray-200 text-lg md:text-xl mb-6 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          {/* Author and Meta Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-gray-300">
              {/* Author */}
              <div className="flex items-center space-x-2">
                {article.author?.profileImageUrl ? (
                  <img
                    src={article.author.profileImageUrl}
                    alt={`${article.author.firstName || 'Author'}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">
                    {article.author?.firstName || article.author?.username || 'Anonymous'}
                    {article.author?.lastName && ` ${article.author.lastName}`}
                  </p>
                  <p className="text-sm text-gray-300">Author</p>
                </div>
              </div>
              
              {/* Time */}
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{timeAgo}</span>
              </div>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{article.viewCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{article.likeCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{article.commentCount || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-6">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Read Full Story
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white hover:text-gray-800 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}