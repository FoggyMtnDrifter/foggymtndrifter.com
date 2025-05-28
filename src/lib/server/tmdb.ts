export class TMDBService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.themoviedb.org/3";
  private readonly imageBaseUrl = "https://image.tmdb.org/t/p";
  private cache: Map<string, any> = new Map();

  constructor() {
    const apiKey = import.meta.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error("Missing required TMDB API key");
    }
    this.apiKey = apiKey;
  }

  private getCacheKey(type: string, title: string, year?: number): string {
    return `${type}:${title}:${year || ""}`;
  }

  private async searchMovie(title: string, year?: number): Promise<any> {
    const cacheKey = this.getCacheKey("movie", title, year);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(
      `${this.baseUrl}/search/movie?api_key=${
        this.apiKey
      }&query=${encodeURIComponent(title)}${
        year ? `&year=${year}` : ""
      }&language=en-US&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`Failed to search TMDB: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results[0];
    if (result) {
      this.cache.set(cacheKey, result);
    }
    return result;
  }

  private async searchTVShow(title: string, year?: number): Promise<any> {
    const cacheKey = this.getCacheKey("tv", title, year);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(
      `${this.baseUrl}/search/tv?api_key=${
        this.apiKey
      }&query=${encodeURIComponent(title)}${
        year ? `&first_air_date_year=${year}` : ""
      }&language=en-US&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`Failed to search TMDB: ${response.status}`);
    }

    const data = await response.json();

    // If no results with year, try without year
    if (!data.results[0] && year) {
      return this.searchTVShow(title);
    }

    const result = data.results[0];
    if (result) {
      this.cache.set(cacheKey, result);
    }
    return result;
  }

  private async searchEpisode(
    seriesId: string,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<any> {
    const cacheKey = `episode:${seriesId}:${seasonNumber}:${episodeNumber}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(
      `${this.baseUrl}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${this.apiKey}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch episode: ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getPosterUrl(
    title: string,
    type: string,
    year?: number,
    episodeTitle?: string
  ): Promise<string | null> {
    try {
      let result;

      // Try TV show search first for both Episode and TvChannel types
      if (type === "Episode" || type === "TvChannel") {
        result = await this.searchTVShow(title, year);
        // If no result, try movie search as fallback
        if (!result) {
          result = await this.searchMovie(title, year);
        }
      } else {
        result = await this.searchMovie(title, year);
      }

      if (!result?.poster_path) {
        return null;
      }

      return `${this.imageBaseUrl}/w500${result.poster_path}`;
    } catch (error) {
      return null;
    }
  }

  async getBackdropUrl(
    title: string,
    type: string,
    year?: number,
    episodeTitle?: string
  ): Promise<string | null> {
    try {
      let result;

      // Try TV show search first for both Episode and TvChannel types
      if (type === "Episode" || type === "TvChannel") {
        result = await this.searchTVShow(title, year);
        // If no result, try movie search as fallback
        if (!result) {
          result = await this.searchMovie(title, year);
        }
      } else {
        result = await this.searchMovie(title, year);
      }

      if (!result?.backdrop_path) {
        return null;
      }

      return `${this.imageBaseUrl}/original${result.backdrop_path}`;
    } catch (error) {
      return null;
    }
  }
}
