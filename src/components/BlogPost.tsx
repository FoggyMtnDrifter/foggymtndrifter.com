import { useEffect, useState } from "react";
import { ArticleLayout } from "./ArticleLayout";
import { BlogPostSkeleton } from "./BlogSkeleton";
import type { FormattedPost } from "@/lib/wordpress";

interface BlogPostProps {
  slug: string;
  isLegal?: boolean;
}

export function BlogPost({ slug, isLegal = false }: BlogPostProps) {
  const [post, setPost] = useState<FormattedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/${isLegal ? "legal" : "posts"}?slug=${slug}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch post");
      }

      // Convert string dates to Date objects
      const postWithDates = {
        ...data,
        pubDate: new Date(data.pubDate),
        modifiedDate: new Date(data.modifiedDate),
      };
      setPost(postWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug, isLegal]);

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={fetchPost}
          className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">Post not found</p>
      </div>
    );
  }

  return (
    <ArticleLayout article={post} slug={slug} isLegal={isLegal}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </ArticleLayout>
  );
}
