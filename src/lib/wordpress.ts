import he from "he";
import { cache } from "./cache";

export interface FormattedPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  modifiedDate: Date;
  content: string;
  imageUrl?: string;
}

interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

const WORDPRESS_API_URL = "https://wp.fmd.gg/wp-json/wp/v2";

// Helper function to get the blog category ID
async function getBlogCategoryId(): Promise<number> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories?slug=blog`);
    if (!response.ok) {
      throw new Error("Unable to fetch blog category");
    }
    const categories = await response.json();
    if (!categories.length) {
      throw new Error("Blog category not found");
    }
    return categories[0].id;
  } catch (error) {
    throw new Error("Unable to fetch blog category");
  }
}

// Helper function to get the legal category ID
async function getLegalCategoryId(): Promise<number> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories?slug=legal`);
    if (!response.ok) {
      throw new Error("Unable to fetch legal category");
    }
    const categories = await response.json();
    if (!categories.length) {
      throw new Error("Legal category not found");
    }
    return categories[0].id;
  } catch (error) {
    throw new Error("Unable to fetch legal category");
  }
}

// Helper function to decode HTML entities (named and numeric)
function decodeHtmlEntities(text: string): string {
  return he.decode(text);
}

// Helper function to clean HTML and return the full text (no truncation)
function cleanAndTruncate(text: string, _maxLength: number = 200): string {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, "");
  // Decode HTML entities
  const decodedText = decodeHtmlEntities(cleanText);
  // Remove extra whitespace
  const trimmedText = decodedText.replace(/\s+/g, " ").trim();
  return trimmedText;
}

export async function getWordPressPosts(): Promise<FormattedPost[]> {
  const cacheKey = "wordpress_posts";
  const cachedPosts = cache.get<FormattedPost[]>(cacheKey);

  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const categoryId = await getBlogCategoryId();
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&per_page=100&categories=${categoryId}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to connect to the blog server. Please try again later."
      );
    }

    const posts: WordPressPost[] = await response.json();

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: decodeHtmlEntities(post.title.rendered),
      slug: post.slug,
      pubDate: new Date(post.date),
      modifiedDate: new Date(post.modified),
      content: post.content.rendered,
      description: decodeHtmlEntities(post.excerpt.rendered),
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    }));

    cache.set(cacheKey, formattedPosts);
    return formattedPosts;
  } catch (error) {
    throw new Error(
      "Unable to connect to the blog server. Please try again later."
    );
  }
}

export async function getLegalPosts(): Promise<FormattedPost[]> {
  const cacheKey = "legal_posts";
  const cachedPosts = cache.get<FormattedPost[]>(cacheKey);

  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const categoryId = await getLegalCategoryId();
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&per_page=100&categories=${categoryId}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to connect to the blog server. Please try again later."
      );
    }

    const posts: WordPressPost[] = await response.json();

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      pubDate: new Date(post.date),
      modifiedDate: new Date(post.modified),
      content: post.content.rendered,
      description: post.excerpt.rendered,
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    }));

    cache.set(cacheKey, formattedPosts);
    return formattedPosts;
  } catch (error) {
    throw new Error(
      "Unable to connect to the blog server. Please try again later."
    );
  }
}

export async function getWordPressPost(
  slug: string
): Promise<FormattedPost | null> {
  const cacheKey = `wordpress_post_${slug}`;
  const cachedPost = cache.get<FormattedPost>(cacheKey);

  if (cachedPost) {
    return cachedPost;
  }

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to connect to the blog server. Please try again later."
      );
    }

    const posts: WordPressPost[] = await response.json();

    if (!posts.length) {
      return null;
    }

    const post = posts[0];
    const formattedPost = {
      id: post.id,
      title: decodeHtmlEntities(post.title.rendered),
      slug: post.slug,
      pubDate: new Date(post.date),
      modifiedDate: new Date(post.modified),
      content: post.content.rendered,
      description: decodeHtmlEntities(post.excerpt.rendered),
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    };

    cache.set(cacheKey, formattedPost);
    return formattedPost;
  } catch (error) {
    throw new Error(
      "Unable to connect to the blog server. Please try again later."
    );
  }
}
