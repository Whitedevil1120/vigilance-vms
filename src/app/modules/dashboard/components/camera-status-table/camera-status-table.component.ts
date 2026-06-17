import { Component, OnInit, OnDestroy, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { CameraService } from '@core/services/camera.service';
import { Subject, takeUntil } from 'rxjs';
import { Camera, CameraStatus, HealthStatus } from '@core/models/camera.model';

@Component({
  selector: 'app-camera-status-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatChipsModule, MatCardModule],
  template: `
    <mat-card class="camera-table-card">
      <mat-card-header>
        <mat-card-title>Camera Status Overview</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-responsive">
          <table mat-table [dataSource]="cameras" class="camera-table">
            <!-- Camera Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Camera Name</th>
              <td mat-cell *matCellDef="let element">{{ element.name }}</td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let element">{{ element.location }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let element">
                <mat-chip [class]="'status-chip status-' + element.status">
                  {{ element.status | uppercase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Health Column -->
            <ng-container matColumnDef="health">
              <th mat-header-cell *matHeaderCellDef>Health</th>
              <td mat-cell *matCellDef="let element">
                <mat-chip [class]="'health-chip health-' + element.healthStatus">
                  {{ element.healthStatus | uppercase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Recording Column -->
            <ng-container matColumnDef="recording">
              <th mat-header-cell *matHeaderCellDef>Recording</th>
              <td mat-cell *matCellDef="let element">
                <mat-icon [class]="element.isRecording ? 'recording-active' : ''">{{ element.isRecording ? 'fiber_manual_record' : 'stop_circle' }}</mat-icon>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button matTooltip="View" color="primary">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Settings" color="accent">
                  <mat-icon>settings</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .camera-table-card {
      margin-top: 2rem;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .camera-table {
      width: 100%;
      border-collapse: collapse;
    }

    .status-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-online { background-color: #c8e6c9; color: #2e7d32; }
    .status-offline { background-color: #ffcdd2; color: #c62828; }
    .status-maintenance { background-color: #fff9c4; color: #f57f17; }
    .status-disabled { background-color: #eeeeee; color: #424242; }

    .health-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .health-healthy { background-color: #c8e6c9; color: #2e7d32; }
    .health-warning { background-color: #fff9c4; color: #f57f17; }
    .health-critical { background-color: #ffcdd2; color: #c62828; }
    .health-unknown { background-color: #eeeeee; color: #424242; }

    .recording-active {
      color: #f44336;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.5; }
    }
  `]
})
export class CameraStatusTableComponent implements OnInit, OnDestroy {
  cameras: Camera[] = [];
  displayedColumns: string[] = ['name', 'location', 'status', 'health', 'recording', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.loadCameras();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCameras(): void {
    this.cameraService
      .getAllCameras()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cameras => (this.cameras = cameras));
  }
}

import { takeUntil } from 'rxjs/operators';
