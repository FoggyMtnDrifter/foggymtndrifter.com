import { useEffect, useState } from "react";
import { Card } from "./Card";
import { formatDate } from "@/lib/formatDate";
import { BlogSkeleton } from "./BlogSkeleton";
import type { FormattedPost } from "@/lib/wordpress";

interface BlogPostsProps {
  limit?: number;
  isHomepage?: boolean;
}

// Helper function to clean HTML and return plain text
function cleanHtml(html: string): string {
  // Remove HTML tags
  const cleanText = html.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  const decodedText = cleanText
    // Named entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    // Numeric decimal entities
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    // Numeric hex entities
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

  // Remove extra whitespace and trim
  return decodedText.replace(/\s+/g, " ").trim();
}

export function BlogPosts({ limit, isHomepage = false }: BlogPostsProps) {
  const [posts, setPosts] = useState<FormattedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      // Convert string dates to Date objects and clean HTML
      const postsWithDates = data.map((post: any) => ({
        ...post,
        pubDate: new Date(post.pubDate),
        modifiedDate: new Date(post.modifiedDate),
        description: cleanHtml(post.description),
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
    return <BlogSkeleton limit={limit || 3} />;
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
            <p className="text-zinc-600 dark:text-zinc-400">No posts found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isHomepage
          ? ""
          : "md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40"
      }
    >
      <div
        className={`flex ${isHomepage ? "" : "max-w-3xl"} flex-col space-y-16`}
      >
        {posts.map((post) => (
          <article
            key={post.id}
            className={
              isHomepage ? "" : "md:grid md:grid-cols-4 md:items-baseline"
            }
          >
            <Card className={isHomepage ? "" : "md:col-span-3"}>
              <Card.Title href={`/blog/${post.slug}`}>{post.title}</Card.Title>
              <Card.Eyebrow
                as="time"
                dateTime={post.pubDate.toISOString()}
                className={isHomepage ? "" : "md:hidden"}
                decorate
              >
                {formatDate(post.pubDate)}
              </Card.Eyebrow>
              <Card.Description>{post.description}</Card.Description>
              <Card.Cta>Read article</Card.Cta>
            </Card>
            {!isHomepage && (
              <Card.Eyebrow
                as="time"
                dateTime={post.pubDate.toISOString()}
                className="mt-1 max-md:hidden"
              >
                {formatDate(post.pubDate)}
              </Card.Eyebrow>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
