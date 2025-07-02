import { useState } from "react";
import { User, NotebookPen, Flame, Video, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="lg:w-1/3 space-y-6">
      {/* Authentication Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <User className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Welcome to Magala Media</h3>
              <p className="text-sm text-gray-600">Login to comment and get personalized news</p>
            </div>
          </div>
          <Button 
            onClick={() => handleSocialLogin("Google")}
            className="w-full bg-red-600 hover:bg-red-700 mb-2"
          >
            <i className="fab fa-google mr-2"></i> Continue with Google
          </Button>
          <Button 
            onClick={() => handleSocialLogin("Facebook")}
            className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
          >
            <i className="fab fa-facebook-f mr-2"></i> Continue with Facebook
          </Button>
          
          <div className="text-center text-sm">
            <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600 p-0">
                  login with email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Newsletter Subscription */}
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <CardContent className="pt-6">
          <h3 className="font-bold text-xl mb-2">Stay Updated</h3>
          <p className="text-sm mb-4">Get the latest news and updates straight to your inbox</p>
          <form onSubmit={handleNewsletterSubscribe} className="flex">
            <Input
              type="email"
              placeholder="Your email address"
              value={subscriptionEmail}
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              className="rounded-l text-black border-0"
              disabled={isSubscribing}
            />
            <Button
              type="submit"
              className="bg-black text-white rounded-r rounded-l-none hover:bg-gray-800"
              disabled={isSubscribing}
            >
              <NotebookPen className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs mt-2 opacity-80">We respect your privacy. Unsubscribe at any time.</p>
        </CardContent>
      </Card>
      
      {/* Trending Now */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="text-orange-500 mr-2" />
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
                <div key={article.id} className="flex">
                  <span className="text-gray-500 font-bold mr-3">{index + 1}</span>
                  <div>
                    <h3 className="font-medium">
                      <button className="hover:text-red-600 transition duration-200 text-left">
                        {article.title}
                      </button>
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{article.viewCount || 0} views</span>
                      <span className="mx-2">•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Talk Shows Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="text-purple-600 mr-2" />
            TALK SHOWS & INTERVIEWS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock talk show data - in a real app this would come from the API */}
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 mr-3">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop"
                  alt="Talk show thumbnail"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-medium">
                  <button className="hover:text-purple-600 transition duration-200 text-left">
                    The Katz Uno Show: Tax Policy Debate
                  </button>
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>45 min</span>
                  <span className="mx-2">•</span>
                  <span>2K views</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 mr-3">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop"
                  alt="Morning show thumbnail"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-medium">
                  <button className="hover:text-purple-600 transition duration-200 text-left">
                    Morning Breeze: Today's Headlines Analysis
                  </button>
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>30 min</span>
                  <span className="mx-2">•</span>
                  <span>1.5K views</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 mr-3">
                <img
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=64&h=64&fit=crop"
                  alt="Interview thumbnail"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-medium">
                  <button className="hover:text-purple-600 transition duration-200 text-left">
                    Exclusive: Finance Minister on New Budget
                  </button>
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>25 min</span>
                  <span className="mx-2">•</span>
                  <span>1.2K views</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-2">
              View All Shows <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Follow Us */}
      <Card>
        <CardHeader>
          <CardTitle>FOLLOW US</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <Button
              onClick={() => handleSocialFollow("facebook")}
              size="lg"
              variant="outline"
              className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 p-0"
            >
              <i className="fab fa-facebook-f"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("instagram")}
              size="lg" 
              variant="outline"
              className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 p-0"
            >
              <i className="fab fa-instagram"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("twitter")}
              size="lg"
              variant="outline" 
              className="w-12 h-12 rounded-full bg-blue-400 text-white hover:bg-blue-500 p-0"
            >
              <i className="fab fa-twitter"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("youtube")}
              size="lg"
              variant="outline"
              className="w-12 h-12 rounded-full bg-red-100 text-red-600 hover:bg-red-200 p-0"
            >
              <i className="fab fa-youtube"></i>
            </Button>
            <Button
              onClick={() => handleSocialFollow("whatsapp")}
              size="lg"
              variant="outline" 
              className="w-12 h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 p-0"
            >
              <i className="fab fa-whatsapp"></i>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
