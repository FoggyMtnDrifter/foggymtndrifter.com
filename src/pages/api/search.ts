import type { APIRoute } from "astro";
import { getWordPressPosts } from "@/lib/wordpress";
import { projects } from "@/data/projects";
import type { CollectionEntry } from "astro:content";
import he from "he";

export const prerender = false;

interface Project {
  name: string;
  description: string;
  link: {
    href: string;
    label: string;
  };
}

interface Article {
  title: string;
  description: string;
  slug: string;
  date: string;
  content?: string;
}

interface SearchResult {
  type: string;
  title: string;
  description: string;
  url: string;
  date: string;
}

// Get blog posts from WordPress
async function getAllArticles() {
  return await getWordPressPosts();
}

function calculateRelevance(
  item: { title: string; description: string; content?: string },
  query: string
) {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Title matches (highest weight)
  if (item.title.toLowerCase().includes(queryLower)) {
    score += 3;
    console.log(`Title match found for "${query}" in: ${item.title}`);
  }

  // Description matches (medium weight)
  if (item.description.toLowerCase().includes(queryLower)) {
    score += 2;
    console.log(
      `Description match found for "${query}" in: ${item.description}`
    );
  }

  // Content matches (lowest weight but still valuable)
  if (item.content && item.content.toLowerCase().includes(queryLower)) {
    score += 1;
    console.log(
      `Content match found for "${query}" in article with title: ${item.title}`
    );
  }

  return score;
}

// Function to strip HTML tags and decode entities
function cleanText(text: string): string {
  // First decode HTML entities
  const decoded = he.decode(text);
  // Then strip HTML tags
  return decoded.replace(/<[^>]*>/g, "");
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.toLowerCase() || "";
  const filter = url.searchParams.get("filter") || "all";

  console.log(`Searching for: "${query}" with filter: ${filter}`);

  if (!query) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const results: SearchResult[] = [];

  try {
    // Search blog posts
    if (filter === "all" || filter === "blog") {
      const posts = await getAllArticles();
      console.log(`Found ${posts.length} blog posts to search through`);

      for (const post of posts) {
        // Search in title and description
        const searchText = `
          ${post.title}
          ${post.description}
        `.toLowerCase();

        if (searchText.includes(query)) {
          console.log(`Match found in post: ${post.title}`);
          results.push({
            type: "blog",
            title: he.decode(post.title),
            description: cleanText(post.description),
            url: `/blog/${post.slug}`,
            date: post.pubDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });
          continue;
        }

        // Search in content if no match in title/description
        if (post.content.toLowerCase().includes(query)) {
          console.log(`Match found in content of post: ${post.title}`);
          results.push({
            type: "blog",
            title: he.decode(post.title),
            description: cleanText(post.description),
            url: `/blog/${post.slug}`,
            date: post.pubDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });
        }
      }
    }

    // Search projects
    if (filter === "all" || filter === "project") {
      console.log(`Searching through ${projects.length} projects`);

      for (const project of projects) {
        const searchableText = `
          ${project.name}
          ${project.description}
        `.toLowerCase();

        if (searchableText.includes(query)) {
          console.log(`Match found in project: ${project.name}`);
          results.push({
            type: "project",
            title: project.name,
            description: project.description,
            url: project.link.href,
            date: project.link.label,
          });
        }
      }
    }

    console.log(`Found ${results.length} total results`);

    // Sort results by relevance (simple implementation)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aDesc = a.description.toLowerCase();
      const bDesc = b.description.toLowerCase();

      // Exact title match gets highest priority
      if (aTitle === query && bTitle !== query) return -1;
      if (bTitle === query && aTitle !== query) return 1;

      // Title contains query gets second priority
      if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
      if (bTitle.includes(query) && !aTitle.includes(query)) return 1;

      // Description contains query gets third priority
      if (aDesc.includes(query) && !bDesc.includes(query)) return -1;
      if (bDesc.includes(query) && !aDesc.includes(query)) return 1;

      return 0;
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
