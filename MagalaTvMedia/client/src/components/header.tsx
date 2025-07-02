import { Search, Menu, User, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BreakingNewsTicker from "./breaking-news-ticker";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onToggleMobileMenu: () => void;
  user?: { email: string; role: string } | null;
  onAuthAction: (action: 'login' | 'logout' | 'admin') => void;
}

export default function Header({ onSearch, searchQuery, onToggleMobileMenu, user, onAuthAction }: HeaderProps) {
  return (
    <div>
      {/* Breaking News Ticker */}
      <BreakingNewsTicker />
      
      {/* Main Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=60&h=60&fit=crop&crop=center"
                alt="Magala Media House logo"
                className="w-15 h-15 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MAGALA MEDIA</h1>
              <p className="text-xs opacity-80">NEWS • TALK SHOWS • EDUTAINMENT</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 md:flex-none md:w-80">
              <Input
                type="text"
                placeholder="Search news, videos, articles..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 border-0"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* User Authentication Section */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm hidden md:block">{user.email.split('@')[0]}</span>
                    {user.role === 'admin' && (
                      <Button
                        onClick={() => onAuthAction('admin')}
                        size="sm"
                        variant="secondary"
                        className="bg-yellow-500 text-black hover:bg-yellow-400"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={() => onAuthAction('logout')}
                    size="sm"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-800"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => onAuthAction('login')}
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-800"
                >
                  <User className="h-3 w-3 mr-1" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMobileMenu}
              className="md:hidden text-white hover:text-gray-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
