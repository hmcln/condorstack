# CondorStack

A modern, production-ready full-stack template designed to accelerate MVP and POC development by eliminating boilerplate setup and providing a solid foundation for rapid iteration.

## 🚀 Stack Overview

CondorStack combines battle-tested technologies to provide a complete development experience out of the box:

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router, Server Components, and Turbo support
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS with latest features
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library

### Backend & Database

- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM with excellent developer experience
- **[Turso](https://turso.tech/)** - Edge SQLite database with global replication
- **[LibSQL](https://libsql.org/)** - SQLite for production environments

### Authentication & User Management

- **[Clerk](https://clerk.com/)** - Complete authentication and user management system
- Pre-configured with social logins, user profiles, and session management

### UI Components & Icons

- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons
- **[Tabler Icons](https://tabler.io/icons)** - Additional icon set
- **[Recharts](https://recharts.org/)** - Composable charting library

### Developer Experience

- **[Task](https://taskfile.dev/)** - Task runner for common operations
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database migrations and introspection
- **[ESLint](https://eslint.org/)** - Code linting with Next.js config
- **Hot reload** with Turbopack for lightning-fast development

## 📁 Project Structure

```
condorstack/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── db/                   # Database configuration
│   ├── schema.ts         # Drizzle schema definitions
│   ├── index.ts          # Database connection
│   └── Taskfile.yml      # Database tasks
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── config/               # Application configuration
└── public/               # Static assets
```

## 🛠 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- [Task](https://taskfile.dev/#/installation) (optional but recommended)

### 1. Environment Setup

```bash
# Copy environment variables
cp .env.example .env.local

# Fill in your environment variables:
# - Clerk keys for authentication
# - Turso database credentials
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

```bash
# Push schema to database
task db:push

# Or without Task:
npx drizzle-kit push
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🎯 Key Features

### Authentication Ready

- Complete authentication flow with Clerk
- Social logins (Google, GitHub, etc.)
- User management and profiles
- Protected routes and middleware

### Database Integration

- Type-safe database operations with Drizzle ORM
- Edge-ready with Turso
- Migration system with Drizzle Kit
- Separate development and production configs

### Modern UI/UX

- Responsive design with Tailwind CSS
- Dark/light theme support
- Accessible components with Radix UI
- Beautiful charts and data visualization

### Developer Productivity

- Hot reload with Turbopack
- TypeScript for type safety
- Automated linting and formatting
- Task runner for common operations

## 📊 Database Management

### Development

```bash
# Push schema changes
task db:push

# Open Drizzle Studio
task db:studio
```

### Production

```bash
# Push to production database
task db:push-prod

# Open production studio
task db:studio-prod
```

## 🚀 Deployment

The stack is optimized for modern deployment platforms:

- **Vercel** - Zero-config deployment for Next.js
- **Netlify** - JAMstack deployment
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

Environment variables to configure:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## 🎨 Customization

### Theme & Styling

- Modify `app/globals.css` for global styles
- Configure Tailwind in `tailwind.config.js`
- Update theme colors in `config/site.ts`
- Add custom components in `components/`

### Database Schema

- Define tables in `db/schema.ts`
- Run `task db:push` to apply changes
- Use Drizzle Studio for data management

### Authentication

- Configure Clerk in the dashboard
- Customize user flows in components
- Add protected routes with middleware

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database (with Task)
task db:push      # Push schema to dev database
task db:push-prod # Push schema to production
task db:studio    # Open Drizzle Studio (dev)
task db:studio-prod # Open Drizzle Studio (prod)
```

## 🤝 Contributing

This template is designed to be a starting point. Fork it, customize it, and build amazing products!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**CondorStack** - From idea to MVP in minutes, not hours. Focus on building features, not infrastructure.

