import { Search, Menu, User, Shield, Bell } from "lucide-react";
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
      <header className="gradient-bg text-white shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo Section */}
            <div className="flex items-center group">
              <div className="mr-4 relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=60&h=60&fit=crop&crop=center"
                  alt="Magala Media House logo"
                  className="w-16 h-16 rounded-full border-3 border-white/30 object-cover relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-xl"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    MAGALA MEDIA
                  </span>
                </h1>
                <p className="text-sm md:text-base opacity-90 font-medium tracking-wide">
                  NEWS • TALK SHOWS • EDUTAINMENT
                </p>
              </div>
            </div>
            
            {/* Search and User Section */}
            <div className="w-full md:w-auto flex items-center space-x-4">
              {/* Enhanced Search Bar */}
              <div className="relative flex-1 md:flex-none md:w-96 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Input
                  type="text"
                  placeholder="Search news, videos, articles..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="search-input relative z-10 text-gray-800 placeholder:text-gray-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* User Authentication Section */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden md:flex items-center space-x-3 glass-effect px-4 py-2 rounded-full">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.email.split('@')[0]}
                      </span>
                      {user.role === 'admin' && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-lg">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    
                    {user.role === 'admin' && (
                      <Button
                        onClick={() => onAuthAction('admin')}
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => onAuthAction('logout')}
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white hover:text-gray-800 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => onAuthAction('login')}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMobileMenu}
                  className="md:hidden text-white hover:text-gray-200 hover:bg-white/10 rounded-full p-2 transition-all duration-300"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}