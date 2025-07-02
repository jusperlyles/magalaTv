import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  const handleNavigate = (section: string) => {
    console.log(`Navigate to ${section}`);
  };

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: "https://facebook.com/magalamedia",
      twitter: "https://twitter.com/magalamedia",
      instagram: "https://instagram.com/magalamedia", 
      youtube: "https://youtube.com/magalamedia",
      whatsapp: "https://wa.me/256700123456",
      telegram: "https://t.me/magalamedia",
    };
    
    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="gradient-bg text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=60&h=60&fit=crop&crop=center"
                alt="Magala Media House logo"
                className="w-12 h-12 rounded-full border-2 border-white/30 object-cover mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold">MAGALA MEDIA HOUSE</h3>
                <p className="text-white/80 text-sm">Uganda's Premier News Source</p>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              Bringing you the latest in NEWS, TALK SHOWS, INTERVIEWS & EDUTAINMENT 24/7. 
              Stay informed with Uganda's most trusted news source, delivering accurate and 
              timely information across all platforms.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
                <Button 
                  type="submit" 
                  className="bg-white text-gray-800 hover:bg-gray-100 px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Button
                onClick={() => handleSocialClick("facebook")}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleSocialClick("twitter")}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleSocialClick("instagram")}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleSocialClick("youtube")}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleSocialClick("whatsapp")}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", action: "home" },
                { name: "About Us", action: "about" },
                { name: "Contact", action: "contact" },
                { name: "Advertise With Us", action: "advertise" },
                { name: "Careers", action: "careers" },
                { name: "Privacy Policy", action: "privacy" },
                { name: "Terms of Service", action: "terms" }
              ].map((link) => (
                <li key={link.action}>
                  <button 
                    onClick={() => handleNavigate(link.action)}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 font-medium">Email</p>
                  <a 
                    href="mailto:jusperkato@gmail.com" 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    jusperkato@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 font-medium">Phone</p>
                  <a 
                    href="tel:+256700123456" 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    +256 700 123456
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 font-medium">Address</p>
                  <p className="text-white/70">
                    Plot 12, Kampala Road<br />
                    Kampala, Uganda
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                &copy; 2025 Magala Media House. All content is protected by copyright law. All Rights Reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Designed with <Heart className="w-3 h-3 inline text-red-400" /> for Uganda
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <button 
                onClick={() => handleNavigate("privacy")}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigate("terms")}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigate("sitemap")}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}