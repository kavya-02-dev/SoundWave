import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';
import { HistoryService, PlayHistory } from '../../services/other.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="header">
        <h1>Good {{ getGreeting() }}, {{ auth.currentUser()?.username }}!</h1>
        <span class="badge" *ngIf="auth.isAdmin">Admin</span>
      </div>

      <section *ngIf="auth.isAdmin" class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎵</div>
          <div class="stat-num">{{ songs.length }}</div>
          <div class="stat-label">Total Songs</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎸</div>
          <div class="stat-num">{{ getUniqueArtists() }}</div>
          <div class="stat-label">Artists</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💿</div>
          <div class="stat-num">{{ getUniqueGenres() }}</div>
          <div class="stat-label">Genres</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">▶️</div>
          <div class="stat-num">{{ history.length }}</div>
          <div class="stat-label">Plays Today</div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2>Recently Played</h2>
          <a routerLink="/history">See all</a>
        </div>
        <div class="song-grid">
          <div *ngFor="let item of history.slice(0,6)" class="song-card" (click)="playSong(item)">
            <div class="cover-wrap">
              <img [src]="item.coverUrl" alt="cover" />
              <div class="play-overlay">▶</div>
            </div>
            <div class="song-card-title">{{ item.title }}</div>
            <div class="song-card-sub">{{ item.artist }}</div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2>Featured Songs</h2>
          <a routerLink="/songs">Browse all</a>
        </div>
        <div class="song-grid">
          <div *ngFor="let song of songs.slice(0,8)" class="song-card" (click)="player.play(song, songs)">
            <div class="cover-wrap">
              <img [src]="song.coverUrl" alt="cover" />
              <div class="play-overlay">▶</div>
              <div class="liked-badge" *ngIf="song.isLiked">💚</div>
            </div>
            <div class="song-card-title">{{ song.title }}</div>
            <div class="song-card-sub">{{ song.artist }}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard { padding: 24px 32px; padding-bottom: 100px; }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
    .badge { background: #1db954; color: black; padding: 4px 12px; border-radius: 30px; font-size: 12px; font-weight: 700; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
    .stat-card { background: #282828; border-radius: 8px; padding: 20px; text-align: center; }
    .stat-card.green { background: linear-gradient(135deg, #1db954, #158a3e); }
    .stat-icon { font-size: 28px; margin-bottom: 8px; }
    .stat-num { color: white; font-size: 32px; font-weight: 700; }
    .stat-label { color: #b3b3b3; font-size: 13px; margin-top: 4px; }
    .stat-card.green .stat-label { color: rgba(255,255,255,0.8); }
    section { margin-bottom: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-header h2 { color: white; font-size: 20px; font-weight: 700; margin: 0; }
    .section-header a { color: #b3b3b3; font-size: 13px; text-decoration: none; font-weight: 600; }
    .section-header a:hover { color: white; }
    .song-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
    .song-card { background: #181818; border-radius: 8px; padding: 16px; cursor: pointer; transition: background 0.2s; }
    .song-card:hover { background: #282828; }
    .cover-wrap { position: relative; margin-bottom: 12px; }
    .cover-wrap img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px; }
    .play-overlay { position: absolute; bottom: 8px; right: 8px; width: 40px; height: 40px; background: #1db954; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; opacity: 0; transform: translateY(4px); transition: all 0.2s; }
    .song-card:hover .play-overlay { opacity: 1; transform: translateY(0); }
    .liked-badge { position: absolute; top: 8px; right: 8px; font-size: 16px; }
    .song-card-title { color: white; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .song-card-sub { color: #b3b3b3; font-size: 12px; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `]
})
export class DashboardComponent implements OnInit {
  songs: Song[] = [];
  history: any[] = [];

  constructor(
    public auth: AuthService,
    public player: PlayerService,
    private songService: SongService,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    this.songService.getAll().subscribe(s => this.songs = s);
    this.historyService.getHistory().subscribe(h => this.history = h);
  }

  getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  getUniqueArtists() { return new Set(this.songs.map(s => s.artist)).size; }
  getUniqueGenres() { return new Set(this.songs.map(s => s.genre)).size; }

  playSong(item: any) {
    const song = this.songs.find(s => s.id === item.songId);
    if (song) this.player.play(song, this.songs);
  }
}
