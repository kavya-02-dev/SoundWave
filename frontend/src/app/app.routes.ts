import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'songs', loadComponent: () => import('./pages/songs/songs.component').then(m => m.SongsComponent) },
      { path: 'history', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) },
      { path: 'liked', loadComponent: () => import('./pages/liked/liked.component').then(m => m.LikedComponent) },
      { path: 'playlists', loadComponent: () => import('./pages/playlists/playlists.component').then(m => m.PlaylistsComponent) },
      { path: 'admin/songs', loadComponent: () => import('./pages/admin/admin-songs/admin-songs.component').then(m => m.AdminSongsComponent), canActivate: [adminGuard] },
      { path: 'admin/users', loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent), canActivate: [adminGuard] },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
