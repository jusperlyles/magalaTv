import ArticleCard from "./article-card";
import type { ArticleWithDetails } from "@/types";

interface ArticleGridProps {
  articles: ArticleWithDetails[];
  user?: { id: number; email: string; firstName?: string; lastName?: string } | null;
  onArticleClick?: (article: ArticleWithDetails) => void;
}

export default function ArticleGrid({ articles, user, onArticleClick }: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          user={user}
          onCardClick={onArticleClick}
        />
      ))}
    </div>
  );
}
