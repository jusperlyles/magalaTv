import { useBreakingNews } from "@/hooks/useArticles";

export default function BreakingNewsTicker() {
  const { data: breakingNews } = useBreakingNews();

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  // Create a repeating ticker text for smooth scrolling
  const newsText = breakingNews.map(article => article.title).join("   •••   ");
  const tickerText = `${newsText}   •••   ${newsText}   •••   ${newsText}`;

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-3 border-b border-red-800 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>
      
      <div className="flex items-center h-10 relative z-10">
        {/* Breaking News Label */}
        <div className="bg-white text-red-600 px-4 py-2 font-bold text-sm flex-shrink-0 z-10 relative rounded-r-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>🚨 BREAKING NEWS</span>
          </div>
        </div>
        
        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative ml-4">
          <div className="animate-scroll-ticker whitespace-nowrap text-sm font-medium py-2 absolute flex items-center">
            <span className="inline-block">{tickerText}</span>
          </div>
        </div>
        
        {/* Fade edges */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-red-600 to-transparent pointer-events-none z-10"></div>
      </div>
      
      {/* Subtle animation line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
    </div>
  )
  );
}