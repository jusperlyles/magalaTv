import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import type { ArticleWithDetails } from "@/types";

interface FeaturedArticleProps {
  article: ArticleWithDetails;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const timeAgo = article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : "Recently";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 article-card">
      <div className="relative h-96">
        <img
          src={article.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          {article.isBreaking && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">BREAKING</span>
          )}
          {article.category && (
            <span className={`bg-${article.category.color || 'blue'}-600 text-white text-xs px-2 py-1 rounded mr-2`}>
              {article.category.name.toUpperCase()}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">{article.title}</h2>
          {article.excerpt && (
            <p className="text-gray-200 mt-2">{article.excerpt}</p>
          )}
          <div className="flex items-center mt-4 text-sm text-gray-300">
            {article.author?.profileImageUrl && (
              <img
                src={article.author.profileImageUrl}
                alt={`${article.author.firstName || 'Author'}'s profile`}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
            )}
            <span>
              By {article.author?.firstName || article.author?.username || 'Anonymous'}
              {article.author?.lastName && ` ${article.author.lastName}`}
            </span>
            <span className="mx-2">•</span>
            <span>{timeAgo}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {article.commentCount || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
