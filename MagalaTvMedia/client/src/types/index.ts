export interface ArticleWithDetails {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  categoryId: number | null;
  authorId: number | null;
  isBreaking: boolean | null;
  isFeatured: boolean | null;
  viewCount: number | null;
  likeCount: number | null;
  publishedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: {
    id: number;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  author?: {
    id: number;
    email: string | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  } | null;
  commentCount?: number;
}

export interface CommentWithDetails {
  id: number;
  content: string;
  articleId: number | null;
  authorId: number | null;
  parentId: number | null;
  likeCount: number | null;
  dislikeCount: number | null;
  createdAt: Date | null;
  author?: {
    id: number;
    email: string | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  } | null;
  article?: {
    id: number;
    title: string;
    slug: string;
  } | null;
}

export interface CategoryWithColor {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  createdAt: Date | null;
}
