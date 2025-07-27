# Adding a Backend Feature

This guide walks you through adding backend functionality to CondorStack, including API routes, database operations, and server-side logic.

## Overview

In modern Next.js (App Router), backend features are built using:
- **API Routes** in `📁 app/api/` directory
- **Server Actions** for form handling and mutations
- **Drizzle ORM** for type-safe database operations
- **Server Components** for data fetching

## Step 1: Define Your Database Schema

⚡ **Modern Practice**: Define your database schema first to ensure type safety throughout your application.

### Example: Adding a "Posts" Feature

📁 `db/schema.ts`
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

// Add to existing schema
export const posts = sqliteTable('posts', {
    id: text().$defaultFn(() => createId()).primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: text('author_id').notNull().references(() => users.id),
    status: text('status', { enum: ['draft', 'published'] }).default('draft'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Export type for TypeScript
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

🔍 **Code Explanation**:
- `createId()` generates unique CUID2 identifiers
- `$inferSelect` and `$inferInsert` create TypeScript types automatically
- `references()` creates foreign key relationships

### Push Schema Changes

```bash
# Push to development database
task db:push

# Or without Task:
npx drizzle-kit push
```

## Step 2: Create API Routes

⚡ **Modern Practice**: Use the App Router API format with named exports for HTTP methods.

### Create CRUD API Routes

📁 `app/api/posts/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/posts - List posts
export async function GET() {
    try {
        const allPosts = await db
            .select({
                id: posts.id,
                title: posts.title,
                content: posts.content,
                status: posts.status,
                createdAt: posts.createdAt,
                author: {
                    id: users.id,
                    fullName: users.fullName,
                    email: users.email,
                }
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.status, 'published'))
            .orderBy(desc(posts.createdAt));

        return NextResponse.json(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create post
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, status = 'draft' } = body;

        // Find user in our database
        const user = await db
            .select()
            .from(users)
            .where(eq(users.providerId, userId))
            .limit(1);

        if (!user.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const newPost = await db
            .insert(posts)
            .values({
                title,
                content,
                status,
                authorId: user[0].id,
            })
            .returning();

        return NextResponse.json(newPost[0], { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
```

### Individual Post Route

📁 `app/api/posts/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/posts/[id] - Get single post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const post = await db
            .select({
                id: posts.id,
                title: posts.title,
                content: posts.content,
                status: posts.status,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
                author: {
                    id: users.id,
                    fullName: users.fullName,
                    email: users.email,
                }
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.id, params.id))
            .limit(1);

        if (!post.length) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, status } = body;

        // Get user from database
        const user = await db
            .select()
            .from(users)
            .where(eq(users.providerId, userId))
            .limit(1);

        if (!user.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update only if user owns the post
        const updatedPost = await db
            .update(posts)
            .set({
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
                updatedAt: new Date().toISOString(),
            })
            .where(and(
                eq(posts.id, params.id),
                eq(posts.authorId, user[0].id)
            ))
            .returning();

        if (!updatedPost.length) {
            return NextResponse.json(
                { error: 'Post not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPost[0]);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}
```

## Step 3: Create Server Actions (Alternative to API Routes)

⚡ **Modern Practice**: Server Actions provide a more integrated approach for form handling and mutations.

📁 `lib/actions/posts.ts`
```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as 'draft' | 'published';

    if (!title || !content) {
        throw new Error('Title and content are required');
    }

    // Get user from database
    const user = await db
        .select()
        .from(users)
        .where(eq(users.providerId, userId))
        .limit(1);

    if (!user.length) {
        throw new Error('User not found');
    }

    try {
        const newPost = await db
            .insert(posts)
            .values({
                title,
                content,
                status: status || 'draft',
                authorId: user[0].id,
            })
            .returning();

        revalidatePath('/dashboard/posts');
        redirect(`/dashboard/posts/${newPost[0].id}`);
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }
}

export async function updatePost(postId: string, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as 'draft' | 'published';

    // Get user from database
    const user = await db
        .select()
        .from(users)
        .where(eq(users.providerId, userId))
        .limit(1);

    if (!user.length) {
        throw new Error('User not found');
    }

    try {
        const updatedPost = await db
            .update(posts)
            .set({
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
                updatedAt: new Date().toISOString(),
            })
            .where(and(
                eq(posts.id, postId),
                eq(posts.authorId, user[0].id)
            ))
            .returning();

        if (!updatedPost.length) {
            throw new Error('Post not found or unauthorized');
        }

        revalidatePath('/dashboard/posts');
        revalidatePath(`/dashboard/posts/${postId}`);
    } catch (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
    }
}
```

## Step 4: Add Database Helper Functions

📁 `lib/data/posts.ts`
```typescript
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { cache } from 'react';

// Cache data fetching functions for Server Components
export const getPosts = cache(async () => {
    return await db
        .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            status: posts.status,
            createdAt: posts.createdAt,
            author: {
                id: users.id,
                fullName: users.fullName,
                email: users.email,
            }
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.status, 'published'))
        .orderBy(desc(posts.createdAt));
});

export const getPostById = cache(async (id: string) => {
    const result = await db
        .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            status: posts.status,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            author: {
                id: users.id,
                fullName: users.fullName,
                email: users.email,
            }
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.id, id))
        .limit(1);

    return result[0] || null;
});

export const getUserPosts = cache(async (userId: string) => {
    return await db
        .select()
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(users.providerId, userId))
        .orderBy(desc(posts.createdAt));
});
```

## Step 5: Test Your Backend

### Using the API Routes
```bash
# Test GET posts
curl http://localhost:3000/api/posts

# Test POST with authentication (get token from browser dev tools)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Post","content":"This is a test post","status":"published"}'
```

### Using Drizzle Studio
```bash
# Open database studio
task db:studio

# View your data at http://localhost:4983
```

## Key Patterns to Remember

⚠️ **Common Pitfalls**:
- Don't forget to handle authentication in protected routes
- Always use `returning()` with insert/update operations if you need the result
- Use `cache()` for data fetching functions to optimize Server Components

💡 **Best Practices**:
- Define database schema first for type safety
- Use Server Actions for forms, API routes for external integrations
- Always handle errors gracefully
- Use `revalidatePath()` to update cached data after mutations
- Leverage Drizzle's type inference for automatic TypeScript types

## Next Steps

- Add validation with Zod schemas
- Implement pagination for large datasets  
- Add search and filtering capabilities
- Set up automated tests for your API endpoints

Need help with frontend integration? Check out [Adding a Frontend Feature](./add-frontend-feature.md).