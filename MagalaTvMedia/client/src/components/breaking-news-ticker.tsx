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
    <div className="bg-red-600 text-white py-2 border-b border-red-700 relative overflow-hidden">
      <div className="flex items-center h-8">
        <div className="bg-white text-red-600 px-3 py-1 font-bold text-xs flex-shrink-0 z-10 relative rounded-r">
          🚨 BREAKING NEWS
        </div>
        <div className="flex-1 overflow-hidden relative ml-2">
          <div className="animate-scroll-ticker whitespace-nowrap text-sm font-medium py-1 absolute">
            {tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}
