# Portfolio CMS

## Overview

This is a full-stack portfolio content management system built with React, Express, and PostgreSQL. The application provides a clean, modern interface for displaying portfolio content with an integrated admin panel for content management. It features a vibrant design system with custom color schemes and supports different content types including text, images, and videos.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color variables and design tokens
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Layer**: Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage implementation with interface for future database integration

### Database Schema
The application uses three main tables:
- **intro_section**: Stores introduction/hero section content with title, name, description, and profile image
- **content_items**: Manages portfolio items with support for text, image, and video content types
- **other_section**: Handles contact information and social media links stored as JSON

### Authentication & Authorization
Currently uses a simple admin mode toggle without formal authentication. The system is designed to easily integrate proper authentication mechanisms.

### Content Management
- **Admin Interface**: Toggle-based admin mode with inline editing capabilities
- **Content Types**: Support for text, image, and video content with rich metadata
- **Real-time Updates**: Optimistic updates with automatic cache invalidation
- **Offline Support**: Local storage backup for content persistence

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Type Safety**: Full TypeScript coverage with shared types between client and server
- **Development Server**: Vite dev server with HMR and Express API integration
- **Code Quality**: ESLint and TypeScript strict mode configuration

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm** & **@neondatabase/serverless**: Database ORM and PostgreSQL driver
- **express**: Backend web framework
- **react** & **react-dom**: Frontend framework
- **vite**: Build tool and development server

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Form Handling & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **drizzle-zod**: Database schema to Zod schema conversion

### Development & Build Tools
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

### Database & Storage
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-kit**: Database migration and schema management tools

The application is configured to work with PostgreSQL through environment variables and uses Drizzle ORM for all database operations with automatic migration support.