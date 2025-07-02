import { useState } from "react";
import { User, NotebookPen, Flame, Video, ChevronRight, TrendingUp, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTrendingArticles } from "@/hooks/useArticles";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export default function Sidebar() {
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const { data: trendingArticles } = useTrendingArticles(5);
  const { toast } = useToast();

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail || !subscriptionEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email: subscriptionEmail });
      toast({
        title: "Success",
        description: "Successfully subscribed to newsletter!",
      });
      setSubscriptionEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    
    // Mock login for now
    toast({
      title: "Success",
      description: "Login functionality coming soon!",
    });
    setIsLoginModalOpen(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon!`,
    });
  };

  const handleSocialFollow = (platform: string) => {
    const urls = {
      facebook: "https://facebook.com/magalamedia",
      instagram: "https://instagram.com/magalamedia", 
      twitter: "https://twitter.com/magalamedia",
      youtube: "https://youtube.com/magalamedia",
      whatsapp: "https://wa.me/256700123456",
    };
    
    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Authentication Panel */}
      <Card className="sidebar-card">
        <CardContent className="pt-6">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-xl mr-4 shadow-lg">
              <User className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Join Magala Media</h3>
              <p className="text-sm text-gray-600">Get personalized news & exclusive content</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleSocialLogin("Google")}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i className="fab fa-google mr-2"></i> Continue with Google
            </Button>
            <Button 
              onClick={() => handleSocialLogin("Facebook")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i className="fab fa-facebook-f mr-2"></i> Continue with Facebook
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600 font-medium">
                  or login with email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Login to Magala Media</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="focus-ring"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="focus-ring"
                    required
                  />
                  <Button type="submit" className="w-full btn-primary">
                    Login
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Newsletter Subscription */}
      <Card className="sidebar-card bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white border-0 shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <NotebookPen className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">Stay Informed</h3>
            <p className="text-sm opacity-90">Get breaking news & exclusive stories delivered to your inbox</p>
          </div>
          
          <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={subscriptionEmail}
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white transition-all duration-300"
              disabled={isSubscribing}
            />
            <Button
              type="submit"
              className="w-full bg-white text-red-600 hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={isSubscribing}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
          
          <p className="text-xs mt-3 opacity-80 text-center">
            📧 Join 10,000+ readers • Unsubscribe anytime
          </p>
        </CardContent>
      </Card>
      
      {/* Trending Now */}
      <Card className="sidebar-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg mr-3">
              <Flame className="text-white h-5 w-5" />
            </div>
            TRENDING NOW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingArticles?.map((article, index) => {
              const timeAgo = article.publishedAt 
                ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                : "Recently";

              return (
                <div key={article.id} className="flex items-start space-x-3 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 text-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>{article.viewCount || 0} views</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Talk Shows Section */}
      <Card className="sidebar-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
              <Video className="text-white h-5 w-5" />
            </div>
            TALK SHOWS & INTERVIEWS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock talk show data */}
            <div className="flex items-start space-x-3 group cursor-pointer">
              <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=48&fit=crop"
                  alt="Talk show thumbnail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                  The Katz Uno Show: Tax Policy Debate
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                  <Badge variant="secondary" className="text-xs">45 min</Badge>
                  <span>•</span>
                  <span>2K views</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 group cursor-pointer">
              <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=48&fit=crop"
                  alt="Morning show thumbnail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                  Morning Breeze: Today's Headlines Analysis
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                  <Badge variant="secondary" className="text-xs">30 min</Badge>
                  <span>•</span>
                  <span>1.5K views</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 group cursor-pointer">
              <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=64&h=48&fit=crop"
                  alt="Interview thumbnail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                  Exclusive: Finance Minister on New Budget
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                  <Badge variant="secondary" className="text-xs">25 min</Badge>
                  <span>•</span>
                  <span>1.2K views</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4 group hover:bg-purple-50 hover:border-purple-200 transition-all duration-300">
              <span className="group-hover:text-purple-600">View All Shows</span>
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Follow Us */}
      <Card className="sidebar-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg mr-3">
              <Users className="text-white h-5 w-5" />
            </div>
            FOLLOW US
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleSocialFollow("facebook")}
              variant="outline"
              className="aspect-square p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
            >
              <i className="fab fa-facebook-f text-xl text-blue-600 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("instagram")}
              variant="outline"
              className="aspect-square p-0 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 group"
            >
              <i className="fab fa-instagram text-xl text-pink-600 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("twitter")}
              variant="outline"
              className="aspect-square p-0 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 group"
            >
              <i className="fab fa-twitter text-xl text-blue-500 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("youtube")}
              variant="outline"
              className="aspect-square p-0 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 group"
            >
              <i className="fab fa-youtube text-xl text-red-600 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("whatsapp")}
              variant="outline"
              className="aspect-square p-0 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 group"
            >
              <i className="fab fa-whatsapp text-xl text-green-600 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
            <Button
              onClick={() => window.open("mailto:jusperkato@gmail.com", "_blank")}
              variant="outline"
              className="aspect-square p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
            >
              <i className="fas fa-envelope text-xl text-gray-600 group-hover:scale-110 transition-transform duration-300"></i>
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Join our community</p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>📱 10K+ followers</span>
              <span>📺 5K+ subscribers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}