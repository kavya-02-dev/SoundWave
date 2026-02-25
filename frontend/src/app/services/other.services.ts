import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PlayHistory {
  id: number;
  songId: number;
  title: string;
  artist: string;
  coverUrl: string;
  playedAt: string;
}

export interface Playlist {
  id: number;
  name: string;
  userId: number;
  songs: any[];
}

export interface AppUser {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private api = 'https://soundwave.onrender.com/api';
  constructor(private http: HttpClient) {}
  getHistory() { return this.http.get<PlayHistory[]>(`${this.api}/history`); }
  clearHistory() { return this.http.delete(`${this.api}/history`); }
}

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private api = 'https://soundwave.onrender.com/api';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<Playlist[]>(`${this.api}/playlists`); }
  create(name: string) { return this.http.post<Playlist>(`${this.api}/playlists`, { name }); }
  addSong(playlistId: number, songId: number) { return this.http.post(`${this.api}/playlists/${playlistId}/songs/${songId}`, {}); }
  removeSong(playlistId: number, songId: number) { return this.http.delete(`${this.api}/playlists/${playlistId}/songs/${songId}`); }
  delete(id: number) { return this.http.delete(`${this.api}/playlists/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://soundwave.onrender.com/api';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<AppUser[]>(`${this.api}/users`); }
}
