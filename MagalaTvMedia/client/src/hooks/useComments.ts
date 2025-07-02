import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CommentWithDetails } from "@/types";

export function useComments(articleId: number) {
  return useQuery({
    queryKey: ["/api/articles", articleId, "comments"],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json() as Promise<CommentWithDetails[]>;
    },
    enabled: !!articleId,
  });
}

export function useTopComments(limit = 5) {
  return useQuery({
    queryKey: ["/api/comments/top", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/comments/top?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch top comments");
      return response.json() as Promise<CommentWithDetails[]>;
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentData: { content: string; articleId: number; authorId: number; parentId?: number }) => {
      return await apiRequest("POST", "/api/comments", commentData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", variables.articleId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/comments/top"] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("POST", `/api/comments/${commentId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments/top"] });
    },
  });
}

export function useDislikeComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("POST", `/api/comments/${commentId}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments/top"] });
    },
  });
}
