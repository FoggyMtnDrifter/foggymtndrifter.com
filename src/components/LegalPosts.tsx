import { useEffect, useState } from "react";
import { Card } from "./Card";
import { formatDate } from "@/lib/formatDate";
import type { FormattedPost } from "@/lib/wordpress";

interface LegalPostsProps {
  limit?: number;
}

export function LegalPosts({ limit }: LegalPostsProps) {
  const [posts, setPosts] = useState<FormattedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/legal");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch legal posts");
      }

      // Convert string dates to Date objects
      const postsWithDates = data.map((post: any) => ({
        ...post,
        pubDate: new Date(post.pubDate),
        modifiedDate: new Date(post.modifiedDate),
      }));

      const sortedPosts = postsWithDates.sort(
        (a: FormattedPost, b: FormattedPost) =>
          b.pubDate.getTime() - a.pubDate.getTime()
      );
      setPosts(limit ? sortedPosts.slice(0, limit) : sortedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit]);

  if (loading) {
    return (
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No legal documents found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
      <div className="flex max-w-3xl flex-col space-y-16">
        {posts.map((post) => (
          <article
            key={post.id}
            className="md:grid md:grid-cols-4 md:items-baseline"
          >
            <Card className="md:col-span-3">
              <Card.Title href={`/legal/${post.slug}`}>{post.title}</Card.Title>
              <Card.Eyebrow
                as="time"
                dateTime={post.pubDate.toISOString()}
                className="md:hidden"
                decorate
              >
                Last Updated: {formatDate(post.pubDate)}
              </Card.Eyebrow>
              <Card.Description>{post.description}</Card.Description>
              <Card.Cta>Read document</Card.Cta>
            </Card>
            <Card.Eyebrow
              as="time"
              dateTime={post.pubDate.toISOString()}
              className="mt-1 max-md:hidden"
            >
              Last Updated: {formatDate(post.pubDate)}
            </Card.Eyebrow>
          </article>
        ))}
      </div>
    </div>
  );
}
