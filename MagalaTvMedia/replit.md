# Magala Media House News Platform

## Overview

This is a full-stack news platform for Magala Media House, built with React, Express, PostgreSQL, and modern web technologies. The application serves as a comprehensive news website featuring articles, categories, comments, and user engagement functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **API Pattern**: RESTful API design
- **Middleware**: Express middleware for request logging and error handling
- **Development**: Hot module replacement with Vite integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection Pooling**: Neon serverless pool for scalable connections

## Key Components

### Database Schema
The application uses a relational database structure with the following core entities:

- **Users**: User accounts with profile information and admin roles
- **Categories**: News categories with slug-based routing and color coding
- **Articles**: Main content with rich metadata (featured, breaking news, view counts)
- **Comments**: Nested comment system with like/dislike functionality
- **Sessions**: Express session management with PostgreSQL storage
- **Newsletter**: Email subscription system

### API Structure
RESTful endpoints organized by resource:

- `/api/articles` - Article CRUD operations with filtering and pagination
- `/api/categories` - Category management
- `/api/comments` - Comment system with engagement features
- `/api/newsletter` - Email subscription management

### UI Component System
Modern component architecture using:

- **Design System**: Shadcn/ui with custom Magala Media branding
- **Responsive Design**: Mobile-first approach with breakpoint management
- **Accessibility**: ARIA-compliant components from Radix UI
- **Interactive Elements**: Toast notifications, dialogs, and form validation

## Data Flow

### Article Management Flow
1. Articles are created with category assignment and author attribution
2. Content supports rich metadata (featured status, breaking news flags)
3. View counts and engagement metrics are tracked automatically
4. Articles can be filtered by category and paginated for performance

### User Engagement Flow
1. Users can interact with articles through likes and comments
2. Comment system supports nested replies and engagement scoring
3. Newsletter subscriptions are managed independently
4. Admin users have additional content management capabilities

### Content Discovery Flow
1. Featured articles are prominently displayed on the homepage
2. Breaking news ticker provides real-time updates
3. Category-based navigation allows topic filtering
4. Search functionality enables content discovery
5. Trending and latest content sections drive engagement

## External Dependencies

### Database Integration
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection Management**: WebSocket support for real-time capabilities
- **Migration System**: Automated schema management with Drizzle

### UI Framework Dependencies
- **Radix UI**: Comprehensive primitive components
- **Lucide React**: Icon system for consistent visual language
- **Date-fns**: Date formatting and manipulation
- **React Hook Form**: Form validation and state management

### Development Tools
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast production bundling for server code
- **PostCSS**: CSS processing with Tailwind integration
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Build Process
1. **Client Build**: Vite optimizes React application for production
2. **Server Build**: ESBuild bundles Node.js application with external packages
3. **Static Assets**: Built client files served from `/dist/public`
4. **Database Migration**: Drizzle migrations run before deployment

### Environment Configuration
- Development mode uses Vite dev server with HMR
- Production mode serves static files through Express
- Database URL configuration through environment variables
- Session management with secure cookie configuration

### Scalability Considerations
- Serverless database connection pooling
- Client-side caching with TanStack Query
- Pagination for large content sets
- Optimized bundle splitting for faster loading

## Changelog
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.