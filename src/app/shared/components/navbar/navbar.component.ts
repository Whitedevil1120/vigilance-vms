import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Observable } from 'rxjs';
import { User } from '@core/models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, RouterModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <mat-icon class="logo-icon">videocam</mat-icon>
          <span class="app-title">Vigilance VMS</span>
        </div>

        <div class="navbar-spacer"></div>

        <div class="navbar-actions">
          <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn">
            <mat-icon [matBadge]="5" matBadgeColor="warn">notifications</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
            <mat-icon>account_circle</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div matMenuContent class="notification-content">
        <h3>Notifications</h3>
        <button mat-menu-item>
          <mat-icon>warning</mat-icon>
          <span>Motion detected in parking area</span>
        </button>
        <button mat-menu-item>
          <mat-icon>offline_pin</mat-icon>
          <span>Server room camera offline</span>
        </button>
        <button mat-menu-item>
          <mat-icon>storage</mat-icon>
          <span>Storage usage at 95%</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          View All
        </button>
      </div>
    </mat-menu>

    <mat-menu #userMenu="matMenu">
      <div mat-menu-item class="user-info" *ngIf="currentUser$ | async as user">
        <strong>{{ user.firstName }} {{ user.lastName }}</strong>
        <small>{{ user.email }}</small>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item>
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-content {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 1rem;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 20px;
      font-weight: 600;
      color: white;
    }

    .logo-icon {
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .app-title {
      letter-spacing: 1px;
    }

    .navbar-spacer {
      flex: 1 1 auto;
    }

    .navbar-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .notification-btn,
    .user-btn {
      color: white;
    }

    .notification-content {
      padding: 1rem;
      min-width: 300px;
    }

    .notification-content h3 {
      margin: 0 0 1rem 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .user-info {
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: default;
    }

    .user-info strong {
      font-size: 14px;
    }

    .user-info small {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private notificationService: NotificationService) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.notificationService.success('Logout', 'You have been logged out successfully');
    });
  }
}
