import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '@core/services/event.service';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { Event } from '@core/models/event.model';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, TimeAgoPipe],
  template: `
    <mat-card class="activity-card">
      <mat-card-header>
        <mat-card-title>Recent Activity</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let event of recentEvents" class="activity-item">
            <mat-icon matListItemIcon [class]="'activity-icon activity-' + event.type">{{ getEventIcon(event.type) }}</mat-icon>
            <div matListItemTitle class="activity-title">{{ event.description }}</div>
            <div matListItemLine class="activity-details">{{ event.source }} • {{ event.timestamp | timeAgo }}</div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .activity-card {
      margin-top: 2rem;
    }

    .activity-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      margin-right: 1rem;
    }

    .activity-login { color: #4caf50; }
    .activity-logout { color: #f44336; }
    .activity-recording_started { color: #2196f3; }
    .activity-alert_triggered { color: #ff9800; }
    .activity-configuration_changed { color: #673ab7; }

    .activity-title {
      font-weight: 500;
      color: #333;
    }

    .activity-details {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class ActivityFeedComponent implements OnInit {
  recentEvents: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getRecentEvents(15).subscribe(events => {
      this.recentEvents = events;
    });
  }

  getEventIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      LOGIN: 'login',
      LOGOUT: 'logout',
      RECORDING_STARTED: 'fiber_manual_record',
      ALERT_TRIGGERED: 'notifications_active',
      CONFIGURATION_CHANGED: 'settings',
      ALERT_ACKNOWLEDGED: 'check_circle',
      SYSTEM_ERROR: 'error'
    };
    return iconMap[type] || 'info';
  }
}
