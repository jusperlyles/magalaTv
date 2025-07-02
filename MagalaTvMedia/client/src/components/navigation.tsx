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
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <ul className="hidden md:flex space-x-1 overflow-x-auto py-3">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onCategoryChange(item.categoryId)}
                className={`block px-4 py-2 transition duration-200 ${
                  activeCategory === item.categoryId
                    ? "text-red-600 font-semibold border-b-2 border-red-600"
                    : "hover:text-red-600"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
          <li className="relative group">
            <button className="block px-4 py-2 hover:text-red-600">SHARE ▼</button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={() => handleShare("whatsapp")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <i className="fab fa-whatsapp mr-2"></i> WhatsApp
              </button>
              <button
                onClick={() => navigator.share?.({ title: "Magala Media", url: window.location.href })}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <i className="fas fa-share-alt mr-2"></i> Share
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <i className="fab fa-facebook mr-2"></i> Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <i className="fab fa-twitter mr-2"></i> Twitter
              </button>
            </div>
          </li>
        </ul>
        
        {/* Mobile Menu */}
        <div className={`md:hidden py-2 bg-white border-t ${isMobileMenuOpen ? "block" : "hidden"}`}>
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onCategoryChange(item.categoryId);
                onToggleMobileMenu();
              }}
              className={`block w-full text-left px-4 py-2 ${
                activeCategory === item.categoryId
                  ? "text-red-600 font-semibold"
                  : "hover:text-red-600"
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="border-t mt-2 pt-2">
            <h4 className="px-4 py-2 font-semibold text-gray-500">SHARE VIA</h4>
            <div className="flex space-x-4 px-4 py-2">
              <button onClick={() => handleShare("whatsapp")} className="text-gray-700">
                <i className="fab fa-whatsapp text-xl"></i>
              </button>
              <button onClick={() => handleShare("facebook")} className="text-gray-700">
                <i className="fab fa-facebook text-xl"></i>
              </button>
              <button onClick={() => handleShare("twitter")} className="text-gray-700">
                <i className="fab fa-twitter text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
