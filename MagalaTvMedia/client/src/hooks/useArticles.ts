import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ArticleWithDetails } from "@/types";

export function useArticles(limit = 20, offset = 0, categoryId?: number) {
  return useQuery({
    queryKey: ["/api/articles", { limit, offset, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (categoryId) {
        params.append("categoryId", categoryId.toString());
      }
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
  });
}

export function useFeaturedArticles(limit = 1) {
  return useQuery({
    queryKey: ["/api/articles/featured", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/articles/featured?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch featured articles");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
  });
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ["/api/articles/breaking"],
    queryFn: async () => {
      const response = await fetch("/api/articles/breaking");
      if (!response.ok) throw new Error("Failed to fetch breaking news");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
  });
}

export function useLatestArticles(limit = 10) {
  return useQuery({
    queryKey: ["/api/articles/latest", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/articles/latest?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch latest articles");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
  });
}

export function useTrendingArticles(limit = 5) {
  return useQuery({
    queryKey: ["/api/articles/trending", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/articles/trending?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch trending articles");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
  });
}

export function useSearchArticles(query: string, limit = 10) {
  return useQuery({
    queryKey: ["/api/articles/search", { query, limit }],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) throw new Error("Failed to search articles");
      return response.json() as Promise<ArticleWithDetails[]>;
    },
    enabled: !!query && query.length > 2,
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: ["/api/articles", id],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${id}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json() as Promise<ArticleWithDetails>;
    },
    enabled: !!id,
  });
}

export function useLikeArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (articleId: number) => {
      await apiRequest("POST", `/api/articles/${articleId}/like`);
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId] });
    },
  });
}
