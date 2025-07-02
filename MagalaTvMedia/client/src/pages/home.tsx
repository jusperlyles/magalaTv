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
import { useFeaturedArticles, useArticles } from "@/hooks/useArticles";
import { useQuery } from "@tanstack/react-query";
import type { CategoryWithColor } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Mock user for now - will be replaced with real authentication
  const mockUser = { email: "jusperkato@gmail.com", role: "admin" };

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
        // TODO: Implement login modal/page
        console.log('Login clicked');
        break;
      case 'logout':
        // TODO: Implement logout
        console.log('Logout clicked');
        break;
      case 'admin':
        setLocation('/admin');
        break;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        user={mockUser}
        onAuthAction={handleAuthAction}
      />
      <Navigation 
        categories={categories || []}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryFilter}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            {isLoadingFeatured ? (
              <div className="bg-white rounded-lg shadow-md h-96 mb-6 animate-pulse" />
            ) : (
              featuredArticles && featuredArticles[0] && (
                <FeaturedArticle article={featuredArticles[0]} />
              )
            )}
            
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleCategoryFilter(undefined)}
                className={`px-4 py-2 rounded-full transition duration-200 ${
                  !activeCategory 
                    ? "bg-red-100 text-red-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-4 py-2 rounded-full transition duration-200 ${
                    activeCategory === category.id
                      ? `bg-${category.color || 'red'}-100 text-${category.color || 'red'}-700`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {isLoadingArticles ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <ArticleGrid 
                articles={articles || []} 
                user={mockUser}
                onArticleClick={(article) => {
                  console.log('Article clicked:', article.title);
                  // TODO: Navigate to article detail page
                }}
              />
            )}
            
            <LatestNews />
          </div>
          
          <Sidebar />
        </div>
      </main>
      
      <AdminControls />
      <Footer />
    </div>
  );
}
