import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService, Song } from '../../../services/song.service';

@Component({
  selector: 'app-admin-songs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🎶 Manage Songs</h1>
        <button class="add-btn" (click)="openCreate()">+ Add Song</button>
      </div>

      <div *ngIf="message" class="message" [class.error]="isError">{{ message }}</div>

      <!-- Song Form Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editingId ? 'Edit Song' : 'Add New Song' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Title *</label>
              <input [(ngModel)]="form.title" placeholder="Song title" />
            </div>
            <div class="form-group">
              <label>Artist *</label>
              <input [(ngModel)]="form.artist" placeholder="Artist name" />
            </div>
            <div class="form-group">
              <label>Album</label>
              <input [(ngModel)]="form.album" placeholder="Album name" />
            </div>
            <div class="form-group">
              <label>Genre</label>
              <input [(ngModel)]="form.genre" placeholder="Genre" />
            </div>
            <div class="form-group full">
              <label>Audio URL *</label>
              <input [(ngModel)]="form.audioUrl" placeholder="https://..." />
            </div>
            <div class="form-group full">
              <label>Cover Image URL</label>
              <input [(ngModel)]="form.coverUrl" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Duration (seconds)</label>
              <input type="number" [(ngModel)]="form.duration" placeholder="240" />
            </div>
          </div>
          <div class="form-actions">
            <button class="cancel-btn" (click)="closeForm()">Cancel</button>
            <button class="save-btn" (click)="save()" [disabled]="saving">
              {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal-overlay" *ngIf="deletingId" (click)="deletingId = null">
        <div class="modal small" (click)="$event.stopPropagation()">
          <h3>Delete Song?</h3>
          <p>This action cannot be undone.</p>
          <div class="form-actions">
            <button class="cancel-btn" (click)="deletingId = null">Cancel</button>
            <button class="delete-btn" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>

      <!-- Songs Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let song of songs">
              <td><img [src]="song.coverUrl" alt="cover" /></td>
              <td class="bold">{{ song.title }}</td>
              <td>{{ song.artist }}</td>
              <td>{{ song.album }}</td>
              <td><span class="genre-tag">{{ song.genre }}</span></td>
              <td>{{ formatTime(song.duration) }}</td>
              <td class="actions">
                <button class="edit-btn" (click)="openEdit(song)">✏️ Edit</button>
                <button class="del-btn" (click)="deletingId = song.id">🗑 Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 32px; padding-bottom: 100px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
    .add-btn { background: #1db954; border: none; color: black; padding: 12px 24px; border-radius: 30px; font-weight: 700; cursor: pointer; font-size: 14px; }
    .message { padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; font-size: 14px; background: #1db954; color: black; font-weight: 600; }
    .message.error { background: #e22134; color: white; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { color: #b3b3b3; font-size: 11px; letter-spacing: 1px; font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 1px solid #282828; }
    tbody tr { cursor: pointer; }
    tbody tr:hover { background: #1a1a1a; }
    tbody td { padding: 12px; color: #b3b3b3; font-size: 14px; border-bottom: 1px solid #1a1a1a; }
    tbody td.bold { color: white; font-weight: 600; }
    tbody td img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
    .genre-tag { background: #282828; padding: 3px 10px; border-radius: 30px; font-size: 12px; }
    .actions { display: flex; gap: 8px; }
    .edit-btn, .del-btn { background: none; border: 1px solid #404040; color: #b3b3b3; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; }
    .edit-btn:hover { border-color: #1db954; color: #1db954; }
    .del-btn:hover { border-color: #e22134; color: #e22134; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: #282828; padding: 32px; border-radius: 12px; width: 560px; max-width: 90vw; }
    .modal.small { width: 320px; text-align: center; }
    .modal h3 { color: white; margin: 0 0 24px; font-size: 20px; }
    .modal p { color: #b3b3b3; margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { color: #b3b3b3; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
    .form-group input { padding: 10px 12px; background: #121212; border: 1px solid #404040; color: white; border-radius: 4px; font-size: 14px; }
    .form-group input:focus { border-color: #1db954; outline: none; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
    .cancel-btn { background: none; border: 1px solid #404040; color: #b3b3b3; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    .save-btn { background: #1db954; border: none; color: black; padding: 10px 24px; border-radius: 4px; font-weight: 700; cursor: pointer; }
    .save-btn:disabled { opacity: 0.5; }
    .delete-btn { background: #e22134; border: none; color: white; padding: 10px 24px; border-radius: 4px; font-weight: 700; cursor: pointer; }
  `]
})
export class AdminSongsComponent implements OnInit {
  songs: Song[] = [];
  showForm = false;
  editingId: number | null = null;
  deletingId: number | null = null;
  saving = false;
  message = '';
  isError = false;

  form = { title: '', artist: '', album: '', genre: '', coverUrl: '', audioUrl: '', duration: 0 };

  constructor(private songService: SongService) {}

  ngOnInit() { this.songService.getAll().subscribe(s => this.songs = s); }

  openCreate() {
    this.editingId = null;
    this.form = { title: '', artist: '', album: '', genre: '', coverUrl: 'https://picsum.photos/seed/newsong/300/300', audioUrl: '', duration: 0 };
    this.showForm = true;
  }

  openEdit(song: Song) {
    this.editingId = song.id;
    this.form = { title: song.title, artist: song.artist, album: song.album, genre: song.genre, coverUrl: song.coverUrl, audioUrl: song.audioUrl, duration: song.duration };
    this.showForm = true;
  }

  closeForm() { this.showForm = false; }

  save() {
    if (!this.form.title || !this.form.artist || !this.form.audioUrl) {
      this.showMsg('Please fill required fields', true);
      return;
    }
    this.saving = true;
    const obs = this.editingId
      ? this.songService.update(this.editingId, this.form)
      : this.songService.create(this.form);
    obs.subscribe({
      next: (song) => {
        if (this.editingId) {
          const i = this.songs.findIndex(s => s.id === this.editingId);
          if (i >= 0) this.songs[i] = { ...song };
        } else {
          this.songs.push(song);
        }
        this.showMsg(this.editingId ? 'Song updated!' : 'Song created!');
        this.closeForm();
        this.saving = false;
      },
      error: () => { this.showMsg('Error saving song', true); this.saving = false; }
    });
  }

  confirmDelete() {
    if (!this.deletingId) return;
    this.songService.delete(this.deletingId).subscribe(() => {
      this.songs = this.songs.filter(s => s.id !== this.deletingId);
      this.deletingId = null;
      this.showMsg('Song deleted');
    });
  }

  showMsg(msg: string, error = false) {
    this.message = msg;
    this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }

  formatTime(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }
}
