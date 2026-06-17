import { Component, OnInit, OnDestroy, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { AlertService } from '@core/services/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from '@core/models/alert.model';

@Component({
  selector: 'app-recent-alerts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <mat-card class="alerts-card">
      <mat-card-header>
        <mat-card-title>Recent Alerts</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-responsive">
          <table mat-table [dataSource]="alerts" class="alerts-table">
            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let element">{{ element.title }}</td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let element">
                <mat-chip>{{ element.type | uppercase }}</mat-chip>
              </td>
            </ng-container>

            <!-- Severity Column -->
            <ng-container matColumnDef="severity">
              <th mat-header-cell *matHeaderCellDef>Severity</th>
              <td mat-cell *matCellDef="let element">
                <mat-chip [class]="'severity-chip severity-' + element.severity">
                  {{ element.severity | uppercase }}
                </mat-chip>
              </td>
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

            <!-- Time Column -->
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef>Time</th>
              <td mat-cell *matCellDef="let element">{{ element.createdAt | date: 'short' }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button matTooltip="Acknowledge" color="primary" [disabled]="element.status !== 'new'">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Details" color="accent">
                  <mat-icon>info</mat-icon>
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
    .alerts-card {
      margin-top: 2rem;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .alerts-table {
      width: 100%;
    }

    .severity-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .severity-critical { background-color: #ffcdd2; color: #c62828; }
    .severity-warning { background-color: #fff9c4; color: #f57f17; }
    .severity-info { background-color: #bbdefb; color: #1565c0; }

    .status-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-new { background-color: #bbdefb; color: #1565c0; }
    .status-acknowledged { background-color: #fff9c4; color: #f57f17; }
    .status-resolved { background-color: #c8e6c9; color: #2e7d32; }
    .status-escalated { background-color: #ffcdd2; color: #c62828; }
  `]
})
export class RecentAlertsComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  displayedColumns: string[] = ['title', 'type', 'severity', 'status', 'time', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAlerts(): void {
    this.alertService
      .getAllAlerts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(alerts => (this.alerts = alerts.slice(0, 10)));
  }
}

import { takeUntil } from 'rxjs/operators';
