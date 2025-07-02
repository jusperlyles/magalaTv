import {
  users,
  articles,
  categories,
  comments,
  newsletters,
  type User,
  type InsertUser,
  type Article,
  type InsertArticle,
  type Category,
  type InsertCategory,
  type Comment,
  type InsertComment,
  type InsertNewsletter,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  updateEmailVerificationToken(id: number, token: string): Promise<void>;
  updatePasswordResetToken(id: number, token: string, expires: Date): Promise<void>;
  verifyEmailByToken(token: string): Promise<User | undefined>;
  resetPasswordByToken(token: string, newPassword: string): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article operations
  getArticles(limit?: number, offset?: number, categoryId?: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getBreakingNews(): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getTrendingArticles(limit?: number): Promise<Article[]>;
  searchArticles(query: string, limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article>;
  incrementViewCount(id: number): Promise<void>;
  incrementLikeCount(id: number): Promise<void>;
  
  // Comment operations
  getCommentsByArticle(articleId: number): Promise<Comment[]>;
  getTopComments(limit?: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  incrementCommentLike(id: number): Promise<void>;
  incrementCommentDislike(id: number): Promise<void>;
  
  // Newsletter operations
  subscribeNewsletter(email: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateEmailVerificationToken(id: number, token: string): Promise<void> {
    await db
      .update(users)
      .set({ emailVerificationToken: token, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async updatePasswordResetToken(id: number, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token, 
        passwordResetExpires: expires,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  async verifyEmailByToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        isEmailVerified: true, 
        emailVerificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.emailVerificationToken, token))
      .returning();
    return user;
  }

  async resetPasswordByToken(token: string, newPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date()
      })
      .where(and(
        eq(users.passwordResetToken, token),
        sql`${users.passwordResetExpires} > NOW()`
      ))
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async getArticles(limit = 20, offset = 0, categoryId?: number): Promise<Article[]> {
    let query = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    if (categoryId) {
      query = query.where(eq(articles.categoryId, categoryId)) as any;
    }

    return await query;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id));

    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug));

    return article;
  }

  async getFeaturedArticles(limit = 1): Promise<Article[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.isFeatured, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getBreakingNews(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.isBreaking, true))
      .orderBy(desc(articles.publishedAt))
      .limit(5);
  }

  async getLatestArticles(limit = 10): Promise<Article[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getTrendingArticles(limit = 5): Promise<Article[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.viewCount))
      .limit(limit);
  }

  async searchArticles(query: string, limit = 10): Promise<Article[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        videoUrl: articles.videoUrl,
        categoryId: articles.categoryId,
        authorId: articles.authorId,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.articleId} = ${articles.id}
        )`,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(like(articles.title, `%${query}%`))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(articleData).returning();
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async incrementViewCount(id: number): Promise<void> {
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id));
  }

  async incrementLikeCount(id: number): Promise<void> {
    await db
      .update(articles)
      .set({ likeCount: sql`${articles.likeCount} + 1` })
      .where(eq(articles.id, id));
  }

  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return await db
      .select({
        id: comments.id,
        content: comments.content,
        articleId: comments.articleId,
        authorId: comments.authorId,
        parentId: comments.parentId,
        likeCount: comments.likeCount,
        dislikeCount: comments.dislikeCount,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.articleId, articleId))
      .orderBy(desc(comments.createdAt));
  }

  async getTopComments(limit = 5): Promise<Comment[]> {
    return await db
      .select({
        id: comments.id,
        content: comments.content,
        articleId: comments.articleId,
        authorId: comments.authorId,
        parentId: comments.parentId,
        likeCount: comments.likeCount,
        dislikeCount: comments.dislikeCount,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
        article: {
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .leftJoin(articles, eq(comments.articleId, articles.id))
      .orderBy(desc(comments.likeCount))
      .limit(limit);
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  async incrementCommentLike(id: number): Promise<void> {
    await db
      .update(comments)
      .set({ likeCount: sql`${comments.likeCount} + 1` })
      .where(eq(comments.id, id));
  }

  async incrementCommentDislike(id: number): Promise<void> {
    await db
      .update(comments)
      .set({ dislikeCount: sql`${comments.dislikeCount} + 1` })
      .where(eq(comments.id, id));
  }

  async subscribeNewsletter(email: string): Promise<void> {
    await db
      .insert(newsletters)
      .values({ email })
      .onConflictDoUpdate({
        target: newsletters.email,
        set: { isActive: true },
      });
  }
}

export const storage = new DatabaseStorage();
