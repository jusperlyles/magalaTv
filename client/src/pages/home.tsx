import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import FeaturedArticle from "@/components/featured-article";
import ArticleGrid from "@/components/article-grid";
import LatestNews from "@/components/latest-news";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import AdminControls from "@/components/admin-controls";
import AuthModal from "@/components/auth-modal";
import { useFeaturedArticles, useArticles } from "@/hooks/useArticles";
import { useQuery } from "@tanstack/react-query";
import type { CategoryWithColor } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Promise<CategoryWithColor[]>;
    },
  });

  const { data: featuredArticles, isLoading: isLoadingFeatured } = useFeaturedArticles(1);
  const { data: articles, isLoading: isLoadingArticles } = useArticles(6, 0, activeCategory);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (categoryId?: number) => {
    setActiveCategory(categoryId);
  };

  const handleAuthAction = (action: 'login' | 'logout' | 'admin') => {
    switch (action) {
      case 'login':
        setIsAuthModalOpen(true);
        break;
      case 'logout':
        setUser(null);
        break;
      case 'admin':
        setLocation('/admin');
        break;
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        user={user}
        onAuthAction={handleAuthAction}
      />
      <Navigation 
        categories={categories || []}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryFilter}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Featured Article */}
            {isLoadingFeatured ? (
              <div className="bg-white rounded-2xl shadow-xl h-96 mb-8 loading-skeleton" />
            ) : (
              featuredArticles && featuredArticles[0] && (
                <FeaturedArticle article={featuredArticles[0]} />
              )
            )}
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-8 animate-slide-in-right">
              <button
                onClick={() => handleCategoryFilter(undefined)}
                className={`category-pill ${
                  !activeCategory 
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All Stories
              </button>
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`category-pill ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg`
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {isLoadingArticles ? (
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm h-80 loading-skeleton" />
                ))}
              </div>
            ) : (
              <ArticleGrid 
                articles={articles || []} 
                user={user}
                onArticleClick={(article) => {
                  console.log('Article clicked:', article.title);
                  // TODO: Navigate to article detail page
                }}
              />
            )}
            
            {/* Latest News Section */}
            <LatestNews />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </main>
      
      {/* Admin Controls - only show for admin users */}
      {user?.role === 'admin' && <AdminControls />}
      
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}