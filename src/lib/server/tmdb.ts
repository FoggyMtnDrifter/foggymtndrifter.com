export class TMDBService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.themoviedb.org/3";
  private readonly imageBaseUrl = "https://image.tmdb.org/t/p";

  constructor() {
    const apiKey = import.meta.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error("Missing required TMDB API key");
    }
    this.apiKey = apiKey;
  }

  private async searchMovie(title: string, year?: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/search/movie?api_key=${
        this.apiKey
      }&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ""}`
    );

    if (!response.ok) {
      throw new Error(`Failed to search TMDB: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0];
  }

  private async searchTVShow(title: string, year?: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/search/tv?api_key=${
        this.apiKey
      }&query=${encodeURIComponent(title)}${
        year ? `&first_air_date_year=${year}` : ""
      }`
    );

    if (!response.ok) {
      throw new Error(`Failed to search TMDB: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0];
  }

  async getPosterUrl(
    title: string,
    type: string,
    year?: number
  ): Promise<string | null> {
    try {
      let result;
      if (type === "Episode") {
        result = await this.searchTVShow(title, year);
      } else {
        result = await this.searchMovie(title, year);
      }

      if (!result?.poster_path) {
        return null;
      }

      return `${this.imageBaseUrl}/w500${result.poster_path}`;
    } catch (error) {
      console.error("Error fetching TMDB poster:", error);
      return null;
    }
  }

  async getBackdropUrl(
    title: string,
    type: string,
    year?: number
  ): Promise<string | null> {
    try {
      let result;
      if (type === "Episode") {
        result = await this.searchTVShow(title, year);
      } else {
        result = await this.searchMovie(title, year);
      }

      if (!result?.backdrop_path) {
        return null;
      }

      return `${this.imageBaseUrl}/original${result.backdrop_path}`;
    } catch (error) {
      console.error("Error fetching TMDB backdrop:", error);
      return null;
    }
  }
}
