import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StorageService } from '@core/services/storage.service';
import { BytesPipe } from '@shared/pipes/bytes.pipe';
import { Storage } from '@core/models/storage.model';

@Component({
  selector: 'app-storage-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, BytesPipe],
  template: `
    <mat-card class="storage-card">
      <mat-card-header>
        <mat-card-title>Storage Status</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="storage-items">
          <div *ngFor="let storage of storages" class="storage-item">
            <div class="storage-header">
              <h4>{{ storage.name }}</h4>
              <span class="storage-type">{{ storage.type | uppercase }}</span>
            </div>
            <div class="storage-info">
              <p class="storage-location">{{ storage.location }}</p>
              <p class="storage-capacity">
                {{ storage.usedCapacity | bytes }} / {{ storage.totalCapacity | bytes }}
              </p>
            </div>
            <mat-progress-bar mode="determinate" [value]="(storage.usedCapacity / storage.totalCapacity) * 100"></mat-progress-bar>
            <div class="storage-percentage">
              {{ ((storage.usedCapacity / storage.totalCapacity) * 100) | number: '1.0-0' }}% Used
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .storage-card {
      margin-top: 2rem;
    }

    .storage-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .storage-item {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .storage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .storage-header h4 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }

    .storage-type {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .storage-info {
      margin-bottom: 0.5rem;
    }

    .storage-location {
      margin: 0 0 0.25rem 0;
      font-size: 12px;
      color: #999;
    }

    .storage-capacity {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .storage-percentage {
      margin-top: 0.5rem;
      font-size: 12px;
      color: #666;
    }

    mat-progress-bar {
      margin: 0.5rem 0;
    }
  `]
})
export class StorageOverviewComponent implements OnInit {
  storages: Storage[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.getAllStorages().subscribe(storages => {
      this.storages = storages;
    });
  }
}
