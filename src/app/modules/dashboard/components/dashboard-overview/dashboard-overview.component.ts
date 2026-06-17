import { Component, OnInit, OnDestroy, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { CameraService } from '@core/services/camera.service';
import { AlertService } from '@core/services/alert.service';
import { StorageService } from '@core/services/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { CameraStatistics } from '@core/models/camera.model';
import { StorageStatistics } from '@core/models/storage.model';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatBadgeModule],
  template: `
    <div class="overview-grid">
      <!-- Cameras Card -->
      <mat-card class="stats-card camera-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>videocam</mat-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-label">Total Cameras</h3>
            <p class="stat-value">{{ cameraStats?.totalCameras || 0 }}</p>
            <p class="stat-detail">{{ cameraStats?.onlineCameras || 0 }} Online</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recording Status Card -->
      <mat-card class="stats-card recording-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>fiber_manual_record</mat-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-label">Recording</h3>
            <p class="stat-value">{{ cameraStats?.recordingCameras || 0 }}</p>
            <p class="stat-detail">Active Recordings</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Alerts Card -->
      <mat-card class="stats-card alert-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon [matBadge]="alertCounts?.new" matBadgeColor="warn">notifications</mat-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-label">Active Alerts</h3>
            <p class="stat-value">{{ alertCounts?.new || 0 }}</p>
            <p class="stat-detail">Pending Review</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Storage Card -->
      <mat-card class="stats-card storage-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>storage</mat-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-label">Storage Usage</h3>
            <p class="stat-value">{{ (storageStats?.utilizationPercentage || 0) | number: '1.0-0' }}%</p>
            <mat-progress-bar mode="determinate" [value]="storageStats?.utilizationPercentage || 0"></mat-progress-bar>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stats-card {
      border-left: 4px solid #1976d2;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stats-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .camera-card { border-left-color: #2196F3; }
    .recording-card { border-left-color: #f44336; }
    .alert-card { border-left-color: #ff9800; }
    .storage-card { border-left-color: #4caf50; }

    mat-card-content {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 60px;
    }

    .stat-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #1976d2;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      margin: 0 0 0.5rem 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      margin: 0.5rem 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .stat-detail {
      margin: 0.5rem 0 0 0;
      font-size: 12px;
      color: #999;
    }

    mat-progress-bar {
      margin-top: 0.5rem;
    }
  `]
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  cameraStats: CameraStatistics | null = null;
  storageStats: StorageStatistics | null = null;
  alertCounts: { new: number; acknowledged: number; resolved: number } = { new: 0, acknowledged: 0, resolved: 0 };

  private destroy$ = new Subject<void>();

  constructor(
    private cameraService: CameraService,
    private alertService: AlertService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStatistics(): void {
    this.cameraService
      .getCameraStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => (this.cameraStats = stats));

    this.alertService
      .getAlertCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => (this.alertCounts = counts));

    this.storageService
      .getStorageStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => (this.storageStats = stats));
  }
}
