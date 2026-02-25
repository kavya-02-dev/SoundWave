import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistService, Playlist } from '../../services/other.services';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../services/song.service';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📋 Your Playlists</h1>
        <button class="create-btn" (click)="showCreate = !showCreate">+ New Playlist</button>
      </div>

      <div *ngIf="showCreate" class="create-form">
        <input [(ngModel)]="newName" placeholder="Playlist name" />
        <button (click)="createPlaylist()">Create</button>
      </div>

      <div *ngIf="!playlists.length && !showCreate" class="empty">No playlists yet. Create your first one!</div>

      <div class="playlists-grid" *ngIf="!selectedPlaylist">
        <div *ngFor="let pl of playlists" class="playlist-card" (click)="selectedPlaylist = pl">
          <div class="pl-icon">📋</div>
          <div class="pl-name">{{ pl.name }}</div>
          <div class="pl-count">{{ pl.songs.length }} songs</div>
          <button class="delete-btn" (click)="deletePlaylist(pl, $event)">🗑</button>
        </div>
      </div>

      <!-- Playlist Detail -->
      <div *ngIf="selectedPlaylist">
        <button class="back-btn" (click)="selectedPlaylist = null">← Back</button>
        <div class="playlist-detail-header">
          <div class="big-icon">📋</div>
          <div>
            <h2>{{ selectedPlaylist.name }}</h2>
            <div class="meta">{{ selectedPlaylist.songs.length }} songs</div>
            <button class="play-all-btn" (click)="playAll()" *ngIf="selectedPlaylist.songs.length">▶ Play All</button>
          </div>
        </div>
        <div *ngIf="!selectedPlaylist.songs.length" class="empty">No songs in this playlist. Add songs from the Songs page!</div>
        <div *ngFor="let song of selectedPlaylist.songs" class="song-row" (click)="player.play(song, selectedPlaylist!.songs)">
          <img [src]="song.coverUrl" alt="cover" />
          <div class="info">
            <div class="title">{{ song.title }}</div>
            <div class="sub">{{ song.artist }}</div>
          </div>
          <div class="duration">{{ player.formatTime(song.duration) }}</div>
          <button (click)="removeSong(song, $event)">✕</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 32px; padding-bottom: 100px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
    .create-btn { background: #1db954; border: none; color: black; padding: 10px 20px; border-radius: 30px; font-weight: 700; cursor: pointer; }
    .create-form { display: flex; gap: 10px; margin-bottom: 24px; padding: 16px; background: #282828; border-radius: 8px; }
    .create-form input { flex: 1; padding: 10px 14px; background: #121212; border: 1px solid #404040; color: white; border-radius: 4px; font-size: 14px; }
    .create-form button { background: #1db954; border: none; color: black; padding: 10px 20px; border-radius: 4px; font-weight: 700; cursor: pointer; }
    .empty { color: #b3b3b3; text-align: center; padding: 60px; font-size: 16px; }
    .playlists-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .playlist-card { background: #181818; border-radius: 8px; padding: 20px; cursor: pointer; position: relative; transition: background 0.2s; }
    .playlist-card:hover { background: #282828; }
    .pl-icon { font-size: 40px; margin-bottom: 12px; }
    .pl-name { color: white; font-size: 15px; font-weight: 600; }
    .pl-count { color: #b3b3b3; font-size: 13px; margin-top: 4px; }
    .delete-btn { position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0; }
    .playlist-card:hover .delete-btn { opacity: 1; }
    .back-btn { background: none; border: none; color: #b3b3b3; cursor: pointer; font-size: 14px; margin-bottom: 16px; padding: 8px 0; }
    .back-btn:hover { color: white; }
    .playlist-detail-header { display: flex; gap: 24px; align-items: flex-end; margin-bottom: 24px; }
    .big-icon { font-size: 80px; }
    h2 { color: white; font-size: 32px; font-weight: 700; margin: 0 0 8px; }
    .meta { color: #b3b3b3; font-size: 14px; }
    .play-all-btn { margin-top: 12px; background: #1db954; border: none; color: black; padding: 12px 28px; border-radius: 30px; font-weight: 700; cursor: pointer; }
    .song-row { display: flex; align-items: center; gap: 16px; padding: 10px 16px; border-radius: 4px; cursor: pointer; }
    .song-row:hover { background: #282828; }
    .song-row img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
    .info { flex: 1; }
    .title { color: white; font-size: 14px; font-weight: 600; }
    .sub { color: #b3b3b3; font-size: 12px; }
    .duration { color: #b3b3b3; font-size: 14px; }
    .song-row button { background: none; border: none; color: #b3b3b3; cursor: pointer; font-size: 16px; padding: 4px 8px; }
    .song-row button:hover { color: #e22134; }
  `]
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  showCreate = false;
  newName = '';

  constructor(public player: PlayerService, private playlistService: PlaylistService) {}

  ngOnInit() { this.playlistService.getAll().subscribe(p => this.playlists = p); }

  createPlaylist() {
    if (!this.newName.trim()) return;
    this.playlistService.create(this.newName).subscribe(p => {
      this.playlists.push(p);
      this.newName = '';
      this.showCreate = false;
    });
  }

  deletePlaylist(pl: Playlist, e: Event) {
    e.stopPropagation();
    this.playlistService.delete(pl.id).subscribe(() => {
      this.playlists = this.playlists.filter(p => p.id !== pl.id);
    });
  }

  playAll() {
    const songs = this.selectedPlaylist?.songs;
    if (songs?.length) this.player.play(songs[0], songs);
  }

  removeSong(song: Song, e: Event) {
    e.stopPropagation();
    if (!this.selectedPlaylist) return;
    this.playlistService.removeSong(this.selectedPlaylist.id, song.id).subscribe(() => {
      this.selectedPlaylist!.songs = this.selectedPlaylist!.songs.filter(s => s.id !== song.id);
    });
  }
}
