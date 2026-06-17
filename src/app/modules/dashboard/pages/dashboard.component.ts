import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { CameraStatusTableComponent } from './camera-status-table/camera-status-table.component';
import { RecentAlertsComponent } from './recent-alerts/recent-alerts.component';
import { StorageOverviewComponent } from './storage-overview/storage-overview.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DashboardOverviewComponent,
    CameraStatusTableComponent,
    RecentAlertsComponent,
    StorageOverviewComponent,
    ActivityFeedComponent
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Dashboard</h1>

      <!-- Overview Stats -->
      <app-dashboard-overview></app-dashboard-overview>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Camera Status Table -->
        <div class="grid-item full-width">
          <app-camera-status-table></app-camera-status-table>
        </div>

        <!-- Recent Alerts -->
        <div class="grid-item">
          <app-recent-alerts></app-recent-alerts>
        </div>

        <!-- Activity Feed -->
        <div class="grid-item">
          <app-activity-feed></app-activity-feed>
        </div>
      </div>

      <!-- Storage Overview -->
      <app-storage-overview></app-storage-overview>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    .dashboard-title {
      margin: 0 0 2rem 0;
      font-size: 32px;
      font-weight: 300;
      color: #333;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .grid-item {
      width: 100%;
    }

    .grid-item.full-width {
      grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {}
}
