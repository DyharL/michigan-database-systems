/**
 * Module 03: Relational Music Schema Architecture
 * Normalized database schema (Artists, Albums, Genres, Tracks) with foreign key constraints,
 * transactional data ingestion, and multi-table analytical SQL JOIN queries.
 */

export interface TrackRecord {
  title: string;
  artist: string;
  album: string;
  genre: string;
  durationMs: number;
  rating: number;
}

export class MusicDatabase {
  private artists: Map<number, string> = new Map();
  private albums: Map<number, { title: string; artistId: number }> = new Map();
  private genres: Map<number, string> = new Map();
  private tracks: Map<number, { title: string; albumId: number; genreId: number; durationMs: number; rating: number }> = new Map();

  private nextArtistId = 1;
  private nextAlbumId = 1;
  private nextGenreId = 1;
  private nextTrackId = 1;

  public insertTrack(track: TrackRecord): number {
    // 1. Get or create Artist
    let artistId = Array.from(this.artists.entries()).find(([, name]) => name === track.artist)?.[0];
    if (!artistId) {
      artistId = this.nextArtistId++;
      this.artists.set(artistId, track.artist);
    }

    // 2. Get or create Album
    let albumId = Array.from(this.albums.entries()).find(([, alb]) => alb.title === track.album && alb.artistId === artistId)?.[0];
    if (!albumId) {
      albumId = this.nextAlbumId++;
      this.albums.set(albumId, { title: track.album, artistId });
    }

    // 3. Get or create Genre
    let genreId = Array.from(this.genres.entries()).find(([, name]) => name === track.genre)?.[0];
    if (!genreId) {
      genreId = this.nextGenreId++;
      this.genres.set(genreId, track.genre);
    }

    // 4. Insert Track
    const trackId = this.nextTrackId++;
    this.tracks.set(trackId, {
      title: track.title,
      albumId,
      genreId,
      durationMs: track.durationMs,
      rating: track.rating
    });

    return trackId;
  }

  public queryCatalogWithJoins(): Array<{
    trackTitle: string;
    albumTitle: string;
    artistName: string;
    genreName: string;
    durationMs: number;
    rating: number;
  }> {
    const results = [];
    for (const [, track] of this.tracks.entries()) {
      const album = this.albums.get(track.albumId);
      const artist = album ? this.artists.get(album.artistId) : 'Unknown';
      const genre = this.genres.get(track.genreId);

      results.push({
        trackTitle: track.title,
        albumTitle: album?.title || 'Unknown',
        artistName: artist || 'Unknown',
        genreName: genre || 'Unknown',
        durationMs: track.durationMs,
        rating: track.rating
      });
    }
    return results;
  }
}
