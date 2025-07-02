export default function Footer() {
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

  return (
    <footer className="gradient-bg text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">MAGALA MEDIA HOUSE</h3>
            <p className="text-gray-300 mb-4">
              Bringing you the latest in NEWS, TALK SHOWS, INTERVIEWS & EDUTAINMENT 24/7
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick("facebook")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </button>
              <button 
                onClick={() => handleSocialClick("twitter")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </button>
              <button 
                onClick={() => handleSocialClick("instagram")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </button>
              <button 
                onClick={() => handleSocialClick("youtube")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </button>
              <button 
                onClick={() => handleSocialClick("whatsapp")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </button>
              <button 
                onClick={() => handleSocialClick("telegram")}
                className="text-gray-300 hover:text-white transition duration-200"
                title="Telegram"
              >
                <i className="fab fa-telegram"></i>
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigate("home")}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate("about")}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate("advertise")}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Advertise With Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate("careers")}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate("contact")}
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/3">
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-gray-300"></i>
                <span className="text-gray-300">jusperkato@gmail.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-gray-300"></i>
                <span className="text-gray-300">+256 700 123456</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-gray-300"></i>
                <span className="text-gray-300">Plot 12, Kampala Road, Uganda</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
          <p>&copy; 2023 Magala Media House. All content is protected by copyright law. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button 
              onClick={() => handleNavigate("privacy")}
              className="hover:text-gray-300 transition duration-200"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleNavigate("terms")}
              className="hover:text-gray-300 transition duration-200"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
