import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, AppUser } from '../../../services/other.services';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>👥 Manage Users</h1>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td class="bold">
                <div class="user-cell">
                  <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                  {{ user.username }}
                </div>
              </td>
              <td><span class="role-badge" [class.admin]="user.role === 'admin'">{{ user.role }}</span></td>
              <td>{{ user.createdAt | date:'MMM d, yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 32px; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0 0 24px; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { color: #b3b3b3; font-size: 11px; letter-spacing: 1px; font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 1px solid #282828; }
    tbody tr:hover { background: #1a1a1a; }
    tbody td { padding: 14px 12px; color: #b3b3b3; font-size: 14px; border-bottom: 1px solid #1a1a1a; }
    tbody td.bold { color: white; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 32px; height: 32px; background: #1db954; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: black; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .role-badge { padding: 4px 12px; border-radius: 30px; font-size: 12px; font-weight: 600; background: #282828; color: #b3b3b3; }
    .role-badge.admin { background: #1db954; color: black; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: AppUser[] = [];
  constructor(private userService: UserService) {}
  ngOnInit() { this.userService.getAll().subscribe(u => this.users = u); }
}
