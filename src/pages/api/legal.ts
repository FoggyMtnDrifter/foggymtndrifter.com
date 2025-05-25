import type { APIRoute } from "astro";
import { getLegalPosts, getWordPressPost } from "@/lib/wordpress";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  try {
    if (slug) {
      const post = await getWordPressPost(slug);
      if (!post) {
        return new Response(
          JSON.stringify({ error: "This legal document could not be found." }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify(post));
    }

    const posts = await getLegalPosts();
    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          "We're having trouble loading the legal documents. Please try again later.",
      }),
      { status: 500 }
    );
  }
};
