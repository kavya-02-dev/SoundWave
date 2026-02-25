import { Injectable, signal } from '@angular/core';
import { Song, SongService } from './song.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  currentSong = signal<Song | null>(null);
  isPlaying = signal(false);
  currentTime = signal(0);
  volume = signal(0.7);
  queue = signal<Song[]>([]);
  queueIndex = signal(0);

  private audio = new Audio();

  constructor(private songService: SongService) {
    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('ended', () => this.next());
    this.audio.volume = this.volume();
  }

  play(song: Song, songList?: Song[]) {
    if (songList) {
      this.queue.set(songList);
      this.queueIndex.set(songList.findIndex(s => s.id === song.id));
    }
    this.currentSong.set(song);
    this.audio.src = song.audioUrl;
    this.audio.play();
    this.isPlaying.set(true);
    this.songService.recordPlay(song.id).subscribe();
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  next() {
    const q = this.queue();
    if (!q.length) return;
    const ni = (this.queueIndex() + 1) % q.length;
    this.queueIndex.set(ni);
    this.play(q[ni], q);
  }

  prev() {
    const q = this.queue();
    if (!q.length) return;
    const ni = (this.queueIndex() - 1 + q.length) % q.length;
    this.queueIndex.set(ni);
    this.play(q[ni], q);
  }

  seek(time: number) {
    this.audio.currentTime = time;
    this.currentTime.set(time);
  }

  setVolume(vol: number) {
    this.audio.volume = vol;
    this.volume.set(vol);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
