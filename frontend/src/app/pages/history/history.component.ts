import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, PlayHistory } from '../../services/other.services';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🕐 Play History</h1>
        <button class="clear-btn" (click)="clearHistory()" *ngIf="history.length">Clear All</button>
      </div>
      <div *ngIf="!history.length" class="empty">No play history yet. Start listening!</div>
      <div class="history-list">
        <div *ngFor="let item of history" class="history-row" (click)="playSong(item)">
          <img [src]="item.coverUrl" alt="cover" />
          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="sub">{{ item.artist }}</div>
          </div>
          <div class="time">{{ item.playedAt | date:'MMM d, h:mm a' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 32px; padding-bottom: 100px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
    .clear-btn { background: none; border: 1px solid #404040; color: #b3b3b3; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .clear-btn:hover { border-color: #e22134; color: #e22134; }
    .empty { color: #b3b3b3; text-align: center; padding: 60px; font-size: 16px; }
    .history-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 4px; cursor: pointer; }
    .history-row:hover { background: #282828; }
    .history-row img { width: 48px; height: 48px; border-radius: 4px; object-fit: cover; }
    .info { flex: 1; }
    .title { color: white; font-size: 14px; font-weight: 600; }
    .sub { color: #b3b3b3; font-size: 12px; }
    .time { color: #b3b3b3; font-size: 12px; }
  `]
})
export class HistoryComponent implements OnInit {
  history: PlayHistory[] = [];
  allSongs: Song[] = [];

  constructor(
    private historyService: HistoryService,
    private songService: SongService,
    public player: PlayerService
  ) {}

  ngOnInit() {
    this.historyService.getHistory().subscribe(h => this.history = h);
    this.songService.getAll().subscribe(s => this.allSongs = s);
  }

  clearHistory() {
    this.historyService.clearHistory().subscribe(() => this.history = []);
  }

  playSong(item: PlayHistory) {
    const song = this.allSongs.find(s => s.id === item.songId);
    if (song) this.player.play(song, this.allSongs);
  }
}
