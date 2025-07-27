# How-To Guides

Welcome to the CondorStack how-to guides! This directory contains step-by-step tutorials for common development tasks in a modern Next.js + Tailwind CSS application.

## Target Audience

These guides are written for developers who are:
- Familiar with web development and React
- New to modern Next.js practices (App Router, Server Components)
- Unfamiliar with Tailwind CSS utility-first approach
- Coming from component libraries or class-based React components
- Want to understand modern full-stack development patterns

## Available Guides

### Development Workflow
- **[Adding a Backend Feature](./add-backend-feature.md)** - Create API routes, database operations, and server-side logic
- **[Adding a Frontend Feature](./add-frontend-feature.md)** - Build client-side features with React Server Components and modern patterns

### Component Development
- **[Adding a New Component](./add-component.md)** - Create reusable components following modern best practices
- **[Editing Existing Components](./edit-component.md)** - Modify and extend existing components safely

## Key Technologies Covered

### Next.js App Router
Modern Next.js uses the App Router (not Pages Router) with:
- File-based routing in the `app/` directory
- Server Components by default
- Client Components when needed (`"use client"`)
- Layouts, pages, and special files

### Tailwind CSS
Utility-first CSS framework:
- No more CSS files for most styling
- Responsive design with breakpoint prefixes
- Dark mode support built-in
- Custom design system through configuration

### Component Architecture
- **shadcn/ui**: Accessible, unstyled components
- **Radix UI**: Low-level accessibility primitives
- **CVA (Class Variance Authority)**: Type-safe component variants
- Component composition over inheritance

### Database & Backend
- **Drizzle ORM**: Type-safe database operations
- **Turso**: Edge SQLite database
- **Clerk**: Authentication and user management

## Getting Started

1. Start with the README.md in the root directory to understand the project structure
2. Choose the guide that matches your current task
3. Follow the step-by-step instructions
4. Reference the existing codebase for patterns and examples

## Conventions

Throughout these guides, we follow these conventions:
- `📁` File/directory references  
- `⚡` Important tips or modern practices
- `🔍` Code explanations
- `⚠️` Common pitfalls to avoid
- `💡` Best practices

Ready to start building? Choose a guide from the list above!