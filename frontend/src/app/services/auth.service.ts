import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  userId: number;
  username: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://soundwave.onrender.com/api';
  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/login`, { username, password }).pipe(
      tap(res => {
        const user: AuthUser = { userId: res.userId, username: res.username, role: res.role, token: res.token };
        localStorage.setItem('auth_user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  get isAdmin() { return this.currentUser()?.role === 'admin'; }
  get token() { return this.currentUser()?.token; }
  get isLoggedIn() { return !!this.currentUser(); }

  private loadUser(): AuthUser | null {
    const s = localStorage.getItem('auth_user');
    return s ? JSON.parse(s) : null;
  }
}
