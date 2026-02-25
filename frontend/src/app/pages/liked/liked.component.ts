import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="liked-header">
        <div class="icon">💚</div>
        <div>
          <div class="type">Playlist</div>
          <h1>Liked Songs</h1>
          <div class="meta">{{ songs.length }} songs</div>
        </div>
      </div>
      <div *ngIf="songs.length" class="play-all">
        <button (click)="playAll()">▶ Play All</button>
      </div>
      <div *ngIf="!songs.length" class="empty">No liked songs yet. Like songs to see them here!</div>
      <div class="song-list">
        <div *ngFor="let song of songs; let i = index" class="song-row" (click)="player.play(song, songs)">
          <span class="num">{{ i + 1 }}</span>
          <img [src]="song.coverUrl" alt="cover" />
          <div class="info">
            <div class="title" [class.green]="player.currentSong()?.id === song.id">{{ song.title }}</div>
            <div class="sub">{{ song.artist }}</div>
          </div>
          <span class="album">{{ song.album }}</span>
          <span class="duration">{{ player.formatTime(song.duration) }}</span>
          <button class="unlike-btn" (click)="unlike(song, $event)">💚</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 32px; padding-bottom: 100px; }
    .liked-header { display: flex; align-items: flex-end; gap: 24px; padding: 40px 0 32px; background: linear-gradient(to bottom, #1a3a1a, transparent); border-radius: 8px; padding: 40px 24px 32px; margin-bottom: 24px; }
    .icon { font-size: 80px; }
    .type { color: white; font-size: 12px; font-weight: 600; letter-spacing: 2px; }
    h1 { color: white; font-size: 40px; font-weight: 900; margin: 8px 0 4px; }
    .meta { color: #b3b3b3; font-size: 14px; }
    .play-all button { background: #1db954; border: none; color: black; padding: 14px 32px; border-radius: 30px; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px; }
    .empty { color: #b3b3b3; text-align: center; padding: 60px; font-size: 16px; }
    .song-row { display: grid; grid-template-columns: 32px 48px 1fr 1fr 60px 40px; gap: 12px; align-items: center; padding: 10px 16px; border-radius: 4px; cursor: pointer; }
    .song-row:hover { background: #282828; }
    .num { color: #b3b3b3; font-size: 14px; }
    .song-row img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
    .title { color: white; font-size: 14px; font-weight: 600; }
    .title.green { color: #1db954; }
    .sub { color: #b3b3b3; font-size: 12px; }
    .album { color: #b3b3b3; font-size: 14px; }
    .duration { color: #b3b3b3; font-size: 14px; text-align: right; }
    .unlike-btn { background: none; border: none; cursor: pointer; font-size: 18px; opacity: 0.7; }
    .unlike-btn:hover { opacity: 1; }
  `]
})
export class LikedComponent implements OnInit {
  songs: Song[] = [];

  constructor(public player: PlayerService, private songService: SongService) {}

  ngOnInit() { this.songService.getLiked().subscribe(s => this.songs = s); }

  playAll() { if (this.songs.length) this.player.play(this.songs[0], this.songs); }

  unlike(song: Song, e: Event) {
    e.stopPropagation();
    this.songService.toggleLike(song.id).subscribe(() => {
      this.songs = this.songs.filter(s => s.id !== song.id);
    });
  }
}
