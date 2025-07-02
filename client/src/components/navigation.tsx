import { Link } from "wouter";
import type { CategoryWithColor } from "@/types";

interface NavigationProps {
  categories: CategoryWithColor[];
  activeCategory?: number;
  onCategoryChange: (categoryId?: number) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export default function Navigation({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  isMobileMenuOpen,
  onToggleMobileMenu 
}: NavigationProps) {
  const navigationItems = [
    { name: "HOME", slug: "", categoryId: undefined },
    ...categories.map(cat => ({ name: cat.name.toUpperCase(), slug: cat.slug, categoryId: cat.id })),
    { name: "ABOUT US", slug: "about", categoryId: undefined },
  ];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Check out Magala Media for the latest news!";
    
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-1 overflow-x-auto py-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onCategoryChange(item.categoryId)}
                className={`nav-link ${
                  activeCategory === item.categoryId ? 'active' : ''
                } whitespace-nowrap`}
              >
                {item.name}
              </button>
            </li>
          ))}
          
          {/* Share Dropdown */}
          <li className="relative group ml-4">
            <button className="nav-link flex items-center space-x-1">
              <span>SHARE</span>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
              >
                <i className="fab fa-whatsapp mr-3 text-lg"></i>
                <span className="font-medium">WhatsApp</span>
              </button>
              <button
                onClick={() => navigator.share?.({ title: "Magala Media", url: window.location.href })}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <i className="fas fa-share-alt mr-3 text-lg"></i>
                <span className="font-medium">Share</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <i className="fab fa-facebook mr-3 text-lg"></i>
                <span className="font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <i className="fab fa-twitter mr-3 text-lg"></i>
                <span className="font-medium">Twitter</span>
              </button>
            </div>
          </li>
        </ul>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
        }`}>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  onCategoryChange(item.categoryId);
                  onToggleMobileMenu();
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === item.categoryId
                    ? "bg-red-100 text-red-600 shadow-sm"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Share Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="px-4 py-2 font-semibold text-gray-500 text-sm uppercase tracking-wide">Share Via</h4>
              <div className="flex justify-around py-3">
                <button 
                  onClick={() => handleShare("whatsapp")} 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <i className="fab fa-whatsapp text-2xl text-green-600"></i>
                  <span className="text-xs text-gray-600">WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleShare("facebook")} 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <i className="fab fa-facebook text-2xl text-blue-600"></i>
                  <span className="text-xs text-gray-600">Facebook</span>
                </button>
                <button 
                  onClick={() => handleShare("twitter")} 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <i className="fab fa-twitter text-2xl text-blue-400"></i>
                  <span className="text-xs text-gray-600">Twitter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}