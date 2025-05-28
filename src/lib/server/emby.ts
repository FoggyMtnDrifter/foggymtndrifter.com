import { z } from "zod";

const embySessionSchema = z
  .object({
    NowPlayingItem: z
      .object({
        Id: z.string(),
        Name: z.string(),
        Type: z.string(),
        SeriesName: z.string().optional(),
        SeasonName: z.string().optional(),
        EpisodeTitle: z.string().optional(),
        ProductionYear: z.number().optional(),
        ImageTags: z.record(z.string()).optional(),
        ProviderIds: z.record(z.string()).optional(),
        BackdropImageTags: z.array(z.string()).optional(),
        SeriesId: z.string().optional(),
        ParentBackdropItemId: z.string().optional(),
        ParentBackdropImageTags: z.array(z.string()).optional(),
        IndexNumber: z.number().optional(),
        ParentIndexNumber: z.number().optional(),
        ChannelName: z.string().optional(),
        CurrentProgram: z
          .object({
            Name: z.string(),
            StartDate: z.string(),
            EndDate: z.string(),
            ProductionYear: z.number().optional(),
            ImageTags: z.record(z.string()).optional(),
            ProviderIds: z.record(z.string()).optional(),
          })
          .optional(),
      })
      .nullable(),
    PlayState: z.object({
      PositionTicks: z.number(),
      IsPaused: z.boolean(),
    }),
  })
  .nullable();

export type EmbySession = z.infer<typeof embySessionSchema>;

export class EmbyService {
  private readonly server: string;
  private readonly apiKey: string;
  private readonly userId: string;

  constructor() {
    const server = import.meta.env.EMBY_SERVER;
    const apiKey = import.meta.env.EMBY_API_KEY;
    const userId = import.meta.env.EMBY_USER_ID;

    if (!server || !apiKey || !userId) {
      throw new Error("Missing required Emby environment variables");
    }

    this.server = server.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.userId = userId;
  }

  async getCurrentSession(): Promise<EmbySession> {
    try {
      const response = await fetch(
        `${this.server}/emby/Sessions?api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Emby sessions: ${response.status}`);
      }

      const sessions = await response.json();
      const userSession = sessions.find(
        (session: any) =>
          session.UserId === this.userId && session.NowPlayingItem
      );

      if (!userSession) {
        return null;
      }

      return embySessionSchema.parse(userSession);
    } catch (error) {
      console.error("Error fetching Emby session:", error);
      return null;
    }
  }

  getImageUrl(itemId: string, imageTag: string): string {
    return `${this.server}/emby/Items/${itemId}/Images/Primary?tag=${imageTag}&api_key=${this.apiKey}`;
  }

  getBackdropUrl(itemId: string, imageTag: string): string {
    return `${this.server}/emby/Items/${itemId}/Images/Backdrop/0?tag=${imageTag}&api_key=${this.apiKey}`;
  }

  async getSeriesImageUrl(
    seriesId: string,
    seriesName: string
  ): Promise<string | null> {
    try {
      console.log(`Searching for series: ${seriesName}`);
      const response = await fetch(
        `${this.server}/emby/Items?api_key=${
          this.apiKey
        }&SearchTerm=${encodeURIComponent(
          seriesName
        )}&IncludeItemTypes=Series&Recursive=true`
      );

      if (!response.ok) {
        console.error(`Failed to search for series: ${response.status}`);
        return null;
      }

      const searchResults = await response.json();
      console.log("Search results:", {
        total: searchResults.TotalRecordCount,
        items: searchResults.Items?.map((item: any) => ({
          id: item.Id,
          name: item.Name,
          type: item.Type,
        })),
      });

      const series = searchResults.Items?.find(
        (item: any) => item.Type === "Series" && item.Name === seriesName
      );

      if (!series) {
        console.error(`Series not found: ${seriesName}`);
        return null;
      }

      const imageTag = series.ImageTags?.Primary;
      if (!imageTag) {
        console.error(`No primary image tag found for series ${seriesName}`);
        return null;
      }

      const imageUrl = this.getImageUrl(series.Id, imageTag);
      console.log(`Generated image URL: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching series image:", error);
      return null;
    }
  }
}
