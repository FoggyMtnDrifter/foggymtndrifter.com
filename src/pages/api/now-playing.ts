import type { APIRoute } from "astro";
import { EmbyService } from "../../lib/server/emby";
import { TMDBService } from "../../lib/server/tmdb";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const embyService = new EmbyService();
    const tmdbService = new TMDBService();
    const session = await embyService.getCurrentSession();

    // Don't return any data if it's live TV or if the content is paused
    if (
      session?.NowPlayingItem?.Type === "TvChannel" ||
      session?.PlayState?.IsPaused
    ) {
      return new Response(
        JSON.stringify({
          playing: false,
          item: null,
          playState: null,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    // Return a clean response when no session is found
    return new Response(
      JSON.stringify({
        playing: !!session?.NowPlayingItem,
        item: session?.NowPlayingItem
          ? {
              name: session.NowPlayingItem.Name,
              type: session.NowPlayingItem.Type,
              seriesName: session.NowPlayingItem.SeriesName,
              seasonName: session.NowPlayingItem.SeasonName,
              episodeTitle:
                session.NowPlayingItem.EpisodeTitle ||
                session.NowPlayingItem.Name,
              productionYear: session.NowPlayingItem.ProductionYear,
              seasonNumber: session.NowPlayingItem.ParentIndexNumber,
              episodeNumber: session.NowPlayingItem.IndexNumber,
              imageUrl: await tmdbService.getPosterUrl(
                session.NowPlayingItem.Type === "Episode"
                  ? session.NowPlayingItem.SeriesName || ""
                  : session.NowPlayingItem.Name,
                session.NowPlayingItem.Type,
                session.NowPlayingItem.ProductionYear
              ),
              backdropUrl: await tmdbService.getBackdropUrl(
                session.NowPlayingItem.Type === "Episode"
                  ? session.NowPlayingItem.SeriesName || ""
                  : session.NowPlayingItem.Name,
                session.NowPlayingItem.Type,
                session.NowPlayingItem.ProductionYear
              ),
            }
          : null,
        playState: null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching now playing status:", error);
    return new Response(
      JSON.stringify({
        playing: false,
        error: "Failed to fetch now playing status",
      }),
      {
        status: 200, // Return 200 even on error to prevent console errors
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
