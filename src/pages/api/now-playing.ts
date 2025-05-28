import type { APIRoute } from "astro";
import { EmbyService } from "../../lib/server/emby";
import { TMDBService } from "../../lib/server/tmdb";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const embyService = new EmbyService();
    const tmdbService = new TMDBService();
    const session = await embyService.getCurrentSession();

    // Don't return any data if the content is paused
    if (session?.PlayState?.IsPaused) {
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
              name:
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.Name ||
                    session.NowPlayingItem.Name
                  : session.NowPlayingItem.Name,
              type: session.NowPlayingItem.Type,
              seriesName:
                session.NowPlayingItem.Type === "TvChannel"
                  ? undefined
                  : session.NowPlayingItem.SeriesName,
              seasonName:
                session.NowPlayingItem.Type === "TvChannel"
                  ? undefined
                  : session.NowPlayingItem.SeasonName,
              episodeTitle:
                session.NowPlayingItem.Type === "TvChannel"
                  ? undefined
                  : session.NowPlayingItem.EpisodeTitle ||
                    session.NowPlayingItem.Name,
              productionYear:
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.ProductionYear
                  : session.NowPlayingItem.ProductionYear,
              seasonNumber:
                session.NowPlayingItem.Type === "TvChannel"
                  ? undefined
                  : session.NowPlayingItem.ParentIndexNumber,
              episodeNumber:
                session.NowPlayingItem.Type === "TvChannel"
                  ? undefined
                  : session.NowPlayingItem.IndexNumber,
              imageUrl: await tmdbService.getPosterUrl(
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.Name ||
                      session.NowPlayingItem.Name
                  : session.NowPlayingItem.Type === "Episode"
                  ? session.NowPlayingItem.SeriesName || ""
                  : session.NowPlayingItem.Name,
                session.NowPlayingItem.Type === "TvChannel"
                  ? "Episode"
                  : session.NowPlayingItem.Type,
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.ProductionYear
                  : session.NowPlayingItem.ProductionYear,
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.Name
                  : session.NowPlayingItem.EpisodeTitle
              ),
              backdropUrl: await tmdbService.getBackdropUrl(
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.Name ||
                      session.NowPlayingItem.Name
                  : session.NowPlayingItem.Type === "Episode"
                  ? session.NowPlayingItem.SeriesName || ""
                  : session.NowPlayingItem.Name,
                session.NowPlayingItem.Type === "TvChannel"
                  ? "Episode"
                  : session.NowPlayingItem.Type,
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.ProductionYear
                  : session.NowPlayingItem.ProductionYear,
                session.NowPlayingItem.Type === "TvChannel"
                  ? session.NowPlayingItem.CurrentProgram?.Name
                  : session.NowPlayingItem.EpisodeTitle
              ),
            }
          : null,
        playState: null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
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
