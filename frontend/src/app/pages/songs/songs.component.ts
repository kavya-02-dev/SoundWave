import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';
import { PlaylistService, Playlist } from '../../services/other.services';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="songs-page">
      <div class="page-header">
        <h1>Songs</h1>
        <div class="search-bar">
          <input type="text" [(ngModel)]="search" (ngModelChange)="filterSongs()" placeholder="🔍 Search songs, artists..." />
        </div>
      </div>

      <div class="genre-filters">
        <button [class.active]="!selectedGenre" (click)="setGenre('')">All</button>
        <button *ngFor="let g of genres" [class.active]="selectedGenre === g" (click)="setGenre(g)">{{ g }}</button>
      </div>

      <div class="song-table">
        <div class="table-header">
          <span>#</span>
          <span>TITLE</span>
          <span>ARTIST</span>
          <span>ALBUM</span>
          <span>GENRE</span>
          <span>DURATION</span>
          <span></span>
        </div>
        <div *ngFor="let song of filteredSongs; let i = index"
          class="song-row"
          [class.playing]="player.currentSong()?.id === song.id"
          (click)="play(song)">
          <span class="track-num">
            <span *ngIf="player.currentSong()?.id !== song.id">{{ i + 1 }}</span>
            <span *ngIf="player.currentSong()?.id === song.id" class="eq-icon">♫</span>
          </span>
          <span class="song-info">
            <img [src]="song.coverUrl" alt="cover" />
            <span class="title">{{ song.title }}</span>
          </span>
          <span class="cell">{{ song.artist }}</span>
          <span class="cell">{{ song.album }}</span>
          <span class="cell"><span class="genre-tag">{{ song.genre }}</span></span>
          <span class="cell">{{ player.formatTime(song.duration) }}</span>
          <span class="actions" (click)="$event.stopPropagation()">
            <button (click)="toggleLike(song)" [class.liked]="song.isLiked" title="Like">{{ song.isLiked ? '💚' : '🤍' }}</button>
            <button (click)="showAddToPlaylist(song)" title="Add to Playlist">➕</button>
          </span>
        </div>
      </div>

      <!-- Add to Playlist Modal -->
      <div class="modal-overlay" *ngIf="selectedSong" (click)="selectedSong = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Add "{{ selectedSong.title }}" to Playlist</h3>
          <div *ngFor="let pl of playlists" class="playlist-option" (click)="addToPlaylist(pl)">
            📋 {{ pl.name }}
          </div>
          <div *ngIf="!playlists.length" style="color: #b3b3b3; text-align: center; padding: 20px;">
            No playlists yet. Create one from the sidebar!
          </div>
          <button class="close-btn" (click)="selectedSong = null">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .songs-page { padding: 24px 32px; padding-bottom: 100px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
    .search-bar input { padding: 10px 16px; background: #282828; border: none; border-radius: 30px; color: white; font-size: 14px; width: 280px; }
    .search-bar input:focus { outline: 2px solid #1db954; }
    .genre-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
    .genre-filters button { padding: 6px 16px; border-radius: 30px; border: 1px solid #404040; background: none; color: #b3b3b3; cursor: pointer; font-size: 13px; }
    .genre-filters button:hover { border-color: white; color: white; }
    .genre-filters button.active { background: white; color: black; border-color: white; font-weight: 600; }
    .song-table { border-radius: 8px; overflow: hidden; }
    .table-header { display: grid; grid-template-columns: 40px 2fr 1.5fr 1.5fr 1fr 80px 80px; padding: 10px 16px; color: #b3b3b3; font-size: 11px; letter-spacing: 1px; font-weight: 600; border-bottom: 1px solid #282828; }
    .song-row { display: grid; grid-template-columns: 40px 2fr 1.5fr 1.5fr 1fr 80px 80px; padding: 10px 16px; align-items: center; border-radius: 4px; cursor: pointer; }
    .song-row:hover { background: #282828; }
    .song-row.playing { background: rgba(29,185,84,0.1); }
    .track-num { color: #b3b3b3; font-size: 14px; }
    .eq-icon { color: #1db954; font-size: 18px; }
    .song-info { display: flex; align-items: center; gap: 12px; }
    .song-info img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
    .title { color: white; font-size: 14px; font-weight: 600; }
    .song-row.playing .title { color: #1db954; }
    .cell { color: #b3b3b3; font-size: 14px; }
    .genre-tag { background: #282828; padding: 3px 10px; border-radius: 30px; font-size: 12px; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; }
    .actions button { background: none; border: none; cursor: pointer; font-size: 18px; opacity: 0.6; padding: 4px; }
    .actions button:hover, .actions button.liked { opacity: 1; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: #282828; padding: 24px; border-radius: 8px; min-width: 300px; }
    .modal h3 { color: white; margin: 0 0 16px; font-size: 16px; }
    .playlist-option { color: white; padding: 12px; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .playlist-option:hover { background: #404040; }
    .close-btn { margin-top: 16px; background: none; border: 1px solid #404040; color: #b3b3b3; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%; }
  `]
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  genres: string[] = [];
  search = '';
  selectedGenre = '';
  selectedSong: Song | null = null;
  playlists: Playlist[] = [];

  constructor(
    public player: PlayerService,
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.songService.getAll().subscribe(s => { this.songs = s; this.filteredSongs = s; });
    this.songService.getGenres().subscribe(g => this.genres = g);
    this.playlistService.getAll().subscribe(p => this.playlists = p);
  }

  filterSongs() {
    this.filteredSongs = this.songs.filter(s =>
      (!this.selectedGenre || s.genre === this.selectedGenre) &&
      (!this.search || s.title.toLowerCase().includes(this.search.toLowerCase()) || s.artist.toLowerCase().includes(this.search.toLowerCase()))
    );
  }

  setGenre(g: string) { this.selectedGenre = g; this.filterSongs(); }
  play(song: Song) { this.player.play(song, this.filteredSongs); }

  toggleLike(song: Song) {
    this.songService.toggleLike(song.id).subscribe(r => song.isLiked = r.liked);
  }

  showAddToPlaylist(song: Song) { this.selectedSong = song; }

  addToPlaylist(pl: Playlist) {
    if (!this.selectedSong) return;
    this.playlistService.addSong(pl.id, this.selectedSong.id).subscribe(() => {
      this.selectedSong = null;
    });
  }
}
