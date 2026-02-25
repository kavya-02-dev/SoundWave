import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  isLiked: boolean;
}

@Injectable({ providedIn: 'root' })
export class SongService {
  private api = 'https://soundwave-b9rq.onrender.com/api';

  constructor(private http: HttpClient) {}

  getAll(search?: string, genre?: string) {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (genre) params = params.set('genre', genre);
    return this.http.get<Song[]>(`${this.api}/songs`, { params });
  }

  getGenres() { return this.http.get<string[]>(`${this.api}/songs/genres`); }
  getLiked() { return this.http.get<Song[]>(`${this.api}/songs/liked`); }

  create(song: Omit<Song, 'id' | 'isLiked'>) {
    return this.http.post<Song>(`${this.api}/songs`, song);
  }

  update(id: number, song: Omit<Song, 'id' | 'isLiked'>) {
    return this.http.put<Song>(`${this.api}/songs/${id}`, song);
  }

  delete(id: number) { return this.http.delete(`${this.api}/songs/${id}`); }
  recordPlay(id: number) { return this.http.post(`${this.api}/songs/${id}/play`, {}); }
  toggleLike(id: number) { return this.http.post<{liked: boolean}>(`${this.api}/songs/${id}/like`, {}); }
}
