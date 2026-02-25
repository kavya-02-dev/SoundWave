import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { PlaylistService, Playlist } from '../services/other.services';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <nav class="sidebar">
        <div class="sidebar-logo">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          <span>Spotify Clone</span>
        </div>

        <div class="nav-section">
          <a routerLink="/dashboard" routerLinkActive="active"><span class="icon">🏠</span> Home</a>
          <a routerLink="/songs" routerLinkActive="active"><span class="icon">🎵</span> Songs</a>
          <a routerLink="/liked" routerLinkActive="active"><span class="icon">💚</span> Liked Songs</a>
          <a routerLink="/history" routerLinkActive="active"><span class="icon">🕐</span> History</a>
          <a routerLink="/playlists" routerLinkActive="active"><span class="icon">📋</span> Playlists</a>
        </div>

        <div class="nav-section" *ngIf="auth.isAdmin">
          <div class="section-label">ADMIN</div>
          <a routerLink="/admin/songs" routerLinkActive="active"><span class="icon">🎶</span> Manage Songs</a>
          <a routerLink="/admin/users" routerLinkActive="active"><span class="icon">👥</span> Manage Users</a>
        </div>

        <div class="sidebar-playlists">
          <div class="section-label">PLAYLISTS</div>
          <div class="playlist-list">
            <div *ngFor="let pl of playlists" class="playlist-item" routerLink="/playlists">{{ pl.name }}</div>
          </div>
          <button class="create-playlist-btn" (click)="showCreatePlaylist = !showCreatePlaylist">+ New Playlist</button>
          <div *ngIf="showCreatePlaylist" class="create-playlist-form">
            <input [(ngModel)]="newPlaylistName" placeholder="Playlist name" />
            <button (click)="createPlaylist()">Create</button>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ auth.currentUser()?.username?.charAt(0)?.toUpperCase() }}</div>
            <div>
              <div class="username">{{ auth.currentUser()?.username }}</div>
              <div class="role">{{ auth.currentUser()?.role }}</div>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.logout()">⏏ Logout</button>
        </div>
      </nav>

      <!-- Main content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>

    <!-- Player Bar -->
    <div class="player-bar" *ngIf="player.currentSong()">
      <div class="player-song-info">
        <img [src]="player.currentSong()!.coverUrl" alt="cover" />
        <div>
          <div class="song-title">{{ player.currentSong()!.title }}</div>
          <div class="song-artist">{{ player.currentSong()!.artist }}</div>
        </div>
      </div>

      <div class="player-controls">
        <button (click)="player.prev()">⏮</button>
        <button class="play-btn" (click)="player.togglePlay()">
          {{ player.isPlaying() ? '⏸' : '▶' }}
        </button>
        <button (click)="player.next()">⏭</button>
      </div>

      <div class="player-progress">
        <span>{{ player.formatTime(player.currentTime()) }}</span>
        <input type="range" min="0" [max]="player.currentSong()!.duration" [value]="player.currentTime()" (input)="onSeek($event)" />
        <span>{{ player.formatTime(player.currentSong()!.duration) }}</span>
      </div>

      <div class="player-volume">
        🔊
        <input type="range" min="0" max="1" step="0.01" [value]="player.volume()" (input)="onVolume($event)" />
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100vh; }
    .app-layout { display: flex; flex: 1; overflow: hidden; background: #121212; }

    .sidebar { width: 240px; background: #000; display: flex; flex-direction: column; padding: 16px; overflow-y: auto; flex-shrink: 0; }
    .sidebar-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    .sidebar-logo span { color: white; font-weight: 700; font-size: 16px; }

    .nav-section { margin-bottom: 20px; }
    .nav-section a { display: flex; align-items: center; gap: 12px; color: #b3b3b3; text-decoration: none; padding: 8px 12px; border-radius: 4px; font-size: 14px; font-weight: 600; margin-bottom: 4px; transition: color 0.2s; }
    .nav-section a:hover, .nav-section a.active { color: white; }
    .nav-section a.active { background: #282828; }
    .section-label { color: #b3b3b3; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 8px 12px 4px; }

    .sidebar-playlists { flex: 1; }
    .playlist-item { color: #b3b3b3; font-size: 14px; padding: 6px 12px; cursor: pointer; border-radius: 4px; }
    .playlist-item:hover { color: white; background: #1a1a1a; }
    .create-playlist-btn { background: none; border: none; color: #b3b3b3; cursor: pointer; font-size: 14px; padding: 8px 12px; width: 100%; text-align: left; }
    .create-playlist-btn:hover { color: white; }
    .create-playlist-form { padding: 8px 12px; }
    .create-playlist-form input { width: 100%; padding: 8px; background: #282828; border: 1px solid #404040; color: white; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
    .create-playlist-form button { margin-top: 6px; background: #1db954; border: none; color: black; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; }

    .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid #282828; }
    .user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .avatar { width: 32px; height: 32px; background: #1db954; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: black; font-weight: 700; }
    .username { color: white; font-size: 13px; font-weight: 600; }
    .role { color: #b3b3b3; font-size: 11px; text-transform: capitalize; }
    .logout-btn { background: none; border: 1px solid #404040; color: #b3b3b3; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; width: 100%; }
    .logout-btn:hover { border-color: white; color: white; }

    .main-content { flex: 1; overflow-y: auto; background: linear-gradient(to bottom, #1a1a2e, #121212); }

    /* Player Bar */
    .player-bar { background: #181818; border-top: 1px solid #282828; padding: 12px 24px; display: flex; align-items: center; gap: 24px; height: 88px; flex-shrink: 0; }
    .player-song-info { display: flex; align-items: center; gap: 12px; width: 220px; }
    .player-song-info img { width: 52px; height: 52px; border-radius: 4px; object-fit: cover; }
    .song-title { color: white; font-size: 13px; font-weight: 600; }
    .song-artist { color: #b3b3b3; font-size: 11px; }
    .player-controls { display: flex; align-items: center; gap: 16px; }
    .player-controls button { background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px; }
    .play-btn { font-size: 28px !important; }
    .player-controls button:hover { color: #1db954; }
    .player-progress { display: flex; align-items: center; gap: 10px; flex: 1; }
    .player-progress span { color: #b3b3b3; font-size: 12px; min-width: 35px; }
    .player-progress input { flex: 1; accent-color: #1db954; height: 4px; }
    .player-volume { display: flex; align-items: center; gap: 8px; width: 120px; color: white; }
    .player-volume input { accent-color: #1db954; flex: 1; }
  `]
})
export class LayoutComponent implements OnInit {
  playlists: Playlist[] = [];
  showCreatePlaylist = false;
  newPlaylistName = '';

  constructor(
    public auth: AuthService,
    public player: PlayerService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() { this.loadPlaylists(); }

  loadPlaylists() {
    this.playlistService.getAll().subscribe(p => this.playlists = p);
  }

  createPlaylist() {
    if (!this.newPlaylistName.trim()) return;
    this.playlistService.create(this.newPlaylistName).subscribe(() => {
      this.newPlaylistName = '';
      this.showCreatePlaylist = false;
      this.loadPlaylists();
    });
  }

  onSeek(e: Event) { this.player.seek(+(e.target as HTMLInputElement).value); }
  onVolume(e: Event) { this.player.setVolume(+(e.target as HTMLInputElement).value); }
}
