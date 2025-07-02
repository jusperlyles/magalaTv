import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCommentSchema, insertCategorySchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      const articles = await storage.getArticles(limit, offset, categoryId);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 1;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/breaking", async (req, res) => {
    try {
      const articles = await storage.getBreakingNews();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  app.get("/api/articles/latest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching latest articles:", error);
      res.status(500).json({ message: "Failed to fetch latest articles" });
    }
  });

  app.get("/api/articles/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const articles = await storage.getTrendingArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching trending articles:", error);
      res.status(500).json({ message: "Failed to fetch trending articles" });
    }
  });

  app.get("/api/articles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const limit = parseInt(req.query.limit as string) || 10;
      const articles = await storage.searchArticles(query, limit);
      res.json(articles);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementViewCount(id);
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        console.error("Error creating article:", error);
        res.status(500).json({ message: "Failed to create article" });
      }
    }
  });

  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementLikeCount(id);
      res.json({ message: "Article liked successfully" });
    } catch (error) {
      console.error("Error liking article:", error);
      res.status(500).json({ message: "Failed to like article" });
    }
  });

  // Comments routes
  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const comments = await storage.getCommentsByArticle(articleId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.get("/api/comments/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const comments = await storage.getTopComments(limit);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching top comments:", error);
      res.status(500).json({ message: "Failed to fetch top comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      } else {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementCommentLike(id);
      res.json({ message: "Comment liked successfully" });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  app.post("/api/comments/:id/dislike", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementCommentDislike(id);
      res.json({ message: "Comment disliked successfully" });
    } catch (error) {
      console.error("Error disliking comment:", error);
      res.status(500).json({ message: "Failed to dislike comment" });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      
      await storage.subscribeNewsletter(email);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
