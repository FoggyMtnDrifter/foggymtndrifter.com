import { useEffect, useState } from "react";

interface NowPlayingItem {
  name: string;
  type: string;
  seriesName?: string;
  seasonName?: string;
  episodeTitle?: string;
  productionYear?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  imageUrl: string | null;
  backdropUrl: string | null;
  channelName?: string;
}

interface NowPlayingData {
  playing: boolean;
  item: NowPlayingItem | null;
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      // Only fetch if we haven't fetched before
      if (hasFetched) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/now-playing");
        const data = await response.json();
        setData(data);
        setHasFetched(true);
      } catch (err) {
        setError("Failed to fetch now playing status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNowPlaying();
  }, [hasFetched]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-zinc-300 bg-zinc-50 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 flex-shrink-0 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.playing || !data.item) {
    return null;
  }

  const { item } = data;

  // Format the display text based on content type
  const getDisplayText = () => {
    if (item.type === "TvChannel") {
      return null;
    }

    if (item.type === "Episode" && item.seriesName) {
      const parts = [
        item.seasonNumber && item.episodeNumber
          ? `S${item.seasonNumber
              .toString()
              .padStart(2, "0")}E${item.episodeNumber
              .toString()
              .padStart(2, "0")}`
          : null,
        item.episodeTitle,
      ].filter(Boolean);

      return parts.join(" • ");
    }

    // For movies or other content
    return item.productionYear ? item.productionYear.toString() : null;
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-300 bg-zinc-50 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      {item.backdropUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url(${item.backdropUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/80 to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-800" />
        </>
      )}
      <div className="relative">
        <div className="flex items-center gap-4">
          {item.imageUrl && (
            <div className="h-24 w-24 flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full rounded object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                {item.seriesName || item.name}
              </h3>
              {getDisplayText() && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {getDisplayText()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
