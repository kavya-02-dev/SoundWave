import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="logo">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          <span>Spotify Clone</span>
        </div>
        <h2>Sign in to continue</h2>
        <div class="error" *ngIf="error">{{ error }}</div>
        <form (ngSubmit)="login()">
          <input type="text" placeholder="Username" [(ngModel)]="username" name="username" required />
          <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'LOG IN' }}
          </button>
        </form>
        <p class="hint">
          <strong>Admin:</strong> admin / admin &nbsp;|&nbsp; <strong>User:</strong> user / user
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-bg { min-height: 100vh; background: #121212; display: flex; align-items: center; justify-content: center; }
    .login-card { background: #282828; padding: 48px 40px; border-radius: 8px; width: 340px; text-align: center; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; }
    .logo span { color: white; font-size: 24px; font-weight: 700; }
    h2 { color: white; margin-bottom: 24px; font-size: 18px; }
    input { display: block; width: 100%; padding: 14px 16px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #404040; background: #121212; color: white; font-size: 14px; box-sizing: border-box; }
    input:focus { border-color: #1db954; outline: none; }
    button { width: 100%; padding: 14px; background: #1db954; color: black; font-weight: 700; border: none; border-radius: 30px; cursor: pointer; font-size: 14px; letter-spacing: 1px; margin-top: 8px; }
    button:hover { background: #1ed760; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { background: #e22134; color: white; padding: 10px; border-radius: 4px; margin-bottom: 16px; font-size: 14px; }
    .hint { color: #b3b3b3; font-size: 12px; margin-top: 20px; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid username or password'; this.loading = false; }
    });
  }
}
