import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@core/models/auth.model';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <mat-nav-list class="nav-list">
          <div class="nav-header">
            <h3>Menu</h3>
          </div>

          <mat-list-item
            *ngFor="let item of menuItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </mat-list-item>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      display: flex;
      height: 100vh;
    }

    .sidenav {
      width: 250px;
      border-right: 1px solid #e0e0e0;
    }

    .nav-list {
      padding-top: 0;
    }

    .nav-header {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 1rem;
    }

    .nav-header h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }

    .nav-item {
      margin: 0.5rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background-color: #f5f5f5;
    }

    .nav-item.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .sidenav-content {
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Cameras', icon: 'videocam', route: '/camera-management' },
    { label: 'Live Monitoring', icon: 'monitor', route: '/live-monitoring' },
    { label: 'Playback', icon: 'play_circle', route: '/playback' },
    { label: 'Security Logs', icon: 'security', route: '/security-logs' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Network', icon: 'router', route: '/network-monitoring' },
    { label: 'Storage', icon: 'storage', route: '/storage-management' },
    { label: 'Users', icon: 'people', route: '/user-management' },
    { label: 'Emergency', icon: 'warning', route: '/emergency-management' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {}
}
