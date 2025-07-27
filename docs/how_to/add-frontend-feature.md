# Adding a Frontend Feature

This guide walks you through building client-side features using modern Next.js patterns, React Server Components, and Tailwind CSS.

## Overview

Modern frontend development in CondorStack uses:
- **Server Components** for data fetching and rendering
- **Client Components** for interactivity (`"use client"`)
- **App Router** for file-based routing
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent UI

## Understanding Server vs Client Components

⚡ **Modern Practice**: Start with Server Components by default, only use Client Components when needed.

### Server Components (Default)
- Run on the server during build or request
- Can directly access databases, APIs, file system
- Cannot use browser APIs or event handlers
- Automatically cached and optimized

### Client Components
- Run in the browser
- Can use React hooks, event handlers, browser APIs
- Use `"use client"` directive at the top
- Hydrated on the client

## Step 1: Create the Page Structure

Let's build a blog posts feature that displays posts and allows creation.

### Create the Main Posts Page

📁 `app/dashboard/posts/page.tsx`
```typescript
import { getPosts } from '@/lib/data/posts';
import { PostsList } from '@/components/posts/posts-list';
import { CreatePostButton } from '@/components/posts/create-post-button';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function PostsPage() {
    // ⚡ Server Component can directly fetch data
    const posts = await getPosts();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground">
                        Manage and create your blog posts
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            <PostsList posts={posts} />
        </div>
    );
}
```

🔍 **Code Explanation**:
- `async function` - Server Components can be async
- Direct data fetching without useEffect
- Tailwind classes for responsive layout
- `asChild` prop renders Button as Link

### Create Individual Post Page

📁 `app/dashboard/posts/[id]/page.tsx`
```typescript
import { getPostById } from '@/lib/data/posts';
import { PostContent } from '@/components/posts/post-content';
import { PostActions } from '@/components/posts/post-actions';
import { notFound } from 'next/navigation';

interface PostPageProps {
    params: {
        id: string;
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound(); // Shows 404 page
    }

    return (
        <div className="container max-w-4xl py-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {post.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>By {post.author?.fullName}</span>
                        <span>•</span>
                        <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                    </div>
                </div>
                <PostActions post={post} />
            </div>

            <div className="mt-8">
                <PostContent content={post.content} />
            </div>
        </div>
    );
}
```

### Create New Post Page

📁 `app/dashboard/posts/new/page.tsx`
```typescript
import { CreatePostForm } from '@/components/posts/create-post-form';

export default function NewPostPage() {
    return (
        <div className="container max-w-4xl py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Post
                </h1>
                <p className="text-muted-foreground">
                    Write and publish your blog post
                </p>
            </div>

            <CreatePostForm />
        </div>
    );
}
```

## Step 2: Create Components

### Posts List Component (Server Component)

📁 `components/posts/posts-list.tsx`
```typescript
import { type Post } from '@/db/schema';
import { PostCard } from './post-card';

interface PostsListProps {
    posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
    if (posts.length === 0) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center">
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-sm text-muted-foreground">
                    Create your first post to get started
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
```

### Post Card Component

📁 `components/posts/post-card.tsx`
```typescript
import { type Post } from '@/db/schema';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface PostCardProps {
    post: Post & {
        author?: {
            fullName: string | null;
        };
    };
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="mb-2"
                    >
                        {post.status}
                    </Badge>
                </div>
                <h3 className="font-semibold leading-tight line-clamp-2">
                    {post.title}
                </h3>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.content}
                </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author?.fullName || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                </div>
                
                <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/posts/${post.id}`}>
                        View
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
```

🔍 **Tailwind Explanation**:
- `line-clamp-2` - Truncates text to 2 lines
- `hover:shadow-md` - Adds shadow on hover
- `transition-shadow` - Smooth shadow animation
- `flex-1` - Takes remaining space in flex container

### Create Post Form (Client Component)

📁 `components/posts/create-post-form.tsx`
```typescript
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/actions/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CreatePostForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await createPost(formData);
                toast.success('Post created successfully!');
                // Navigation handled by server action
            } catch (error) {
                toast.error(
                    error instanceof Error 
                        ? error.message 
                        : 'Failed to create post'
                );
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter post title..."
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Write your post content..."
                            rows={10}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="draft">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Post
                        </Button>
                        
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
```

⚡ **Modern Patterns**:
- `useTransition()` for pending states
- Server Actions with form actions
- `toast` for user feedback
- Progressive enhancement (works without JS)

### Interactive Post Actions (Client Component)

📁 `components/posts/post-actions.tsx`
```typescript
'use client';

import { useState } from 'react';
import { type Post } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface PostActionsProps {
    post: Post;
}

export function PostActions({ post }: PostActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog 
                open={showDeleteDialog} 
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{post.title}"? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                // Handle delete - could be server action
                                console.log('Delete post:', post.id);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
```

## Step 3: Add Loading and Error States

### Loading Page

📁 `app/dashboard/posts/loading.tsx`
```typescript
import { Skeleton } from '@/components/ui/skeleton';

export default function PostsLoading() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="h-6 w-16 mb-2" />
                        <Skeleton className="h-6 w-full mb-4" />
                        <Skeleton className="h-20 w-full mb-4" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### Error Page

📁 `app/dashboard/posts/error.tsx`
```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function PostsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Posts error:', error);
    }, [error]);

    return (
        <div className="flex h-[400px] flex-col items-center justify-center gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                    Failed to load posts. Please try again.
                </p>
            </div>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
```

## Step 4: Add to Navigation

Update your navigation to include the posts section:

📁 `components/nav-main.tsx` (or similar navigation file)
```typescript
// Add to your navigation items
{
    title: "Posts",
    url: "/dashboard/posts",
    icon: FileText,
    items: [
        {
            title: "All Posts",
            url: "/dashboard/posts",
        },
        {
            title: "Create Post",
            url: "/dashboard/posts/new",
        },
    ],
}
```

## Key Patterns to Remember

⚠️ **Common Pitfalls**:
- Don't use `"use client"` unless you need browser APIs or interactivity
- Remember to handle loading and error states
- Always validate user input on both client and server

💡 **Best Practices**:
- Start with Server Components, add Client Components only when needed
- Use `useTransition()` for better UX during mutations
- Implement proper error boundaries and loading states
- Keep components small and focused on single responsibilities
- Use Tailwind utilities for consistent spacing and typography

## Next Steps

- Add search and filtering functionality
- Implement optimistic updates for better UX
- Add real-time features with WebSockets
- Create reusable data fetching hooks

Need help creating reusable components? Check out [Adding a Component](./add-component.md).