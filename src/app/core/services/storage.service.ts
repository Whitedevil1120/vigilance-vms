import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, interval } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Storage, StorageStatus, StorageStatistics, StorageUsageRecord } from '../models/storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private mockStorages: Storage[] = [
    {
      id: '1',
      name: 'Primary NAS Storage',
      type: 'network',
      location: 'Data Center - Rack A',
      totalCapacity: 100 * 1024 * 1024 * 1024 * 1024, // 100 TB
      usedCapacity: 75 * 1024 * 1024 * 1024 * 1024, // 75 TB
      availableCapacity: 25 * 1024 * 1024 * 1024 * 1024, // 25 TB
      status: StorageStatus.ONLINE,
      healthScore: 85,
      lastHealthCheck: new Date(),
      cameras: ['1', '2', '4', '5'],
      retentionDays: 30,
      priority: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Secondary SAN Storage',
      type: 'network',
      location: 'Data Center - Rack B',
      totalCapacity: 50 * 1024 * 1024 * 1024 * 1024, // 50 TB
      usedCapacity: 30 * 1024 * 1024 * 1024 * 1024, // 30 TB
      availableCapacity: 20 * 1024 * 1024 * 1024 * 1024, // 20 TB
      status: StorageStatus.ONLINE,
      healthScore: 92,
      lastHealthCheck: new Date(),
      cameras: ['3'],
      retentionDays: 15,
      priority: 2,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Cloud Archive Storage',
      type: 'cloud',
      location: 'AWS S3 - us-east-1',
      totalCapacity: 500 * 1024 * 1024 * 1024 * 1024, // 500 TB
      usedCapacity: 120 * 1024 * 1024 * 1024 * 1024, // 120 TB
      availableCapacity: 380 * 1024 * 1024 * 1024 * 1024, // 380 TB
      status: StorageStatus.ONLINE,
      healthScore: 95,
      lastHealthCheck: new Date(),
      cameras: ['1', '2', '3', '4', '5'],
      retentionDays: 90,
      priority: 3,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    }
  ];

  private storages$ = new BehaviorSubject<Storage[]>(this.mockStorages);
  private usageHistory$ = new BehaviorSubject<StorageUsageRecord[]>(this.generateUsageHistory());

  constructor() {}

  getAllStorages(): Observable<Storage[]> {
    return this.storages$.asObservable().pipe(delay(300));
  }

  getStorageById(id: string): Observable<Storage | undefined> {
    return of(this.mockStorages.find(s => s.id === id)).pipe(delay(300));
  }

  getStorageStatistics(): Observable<StorageStatistics> {
    return of(this.mockStorages).pipe(
      map(storages => {
        const totalStorage = storages.reduce((sum, s) => sum + s.totalCapacity, 0);
        const usedStorage = storages.reduce((sum, s) => sum + s.usedCapacity, 0);
        const availableStorage = storages.reduce((sum, s) => sum + s.availableCapacity, 0);

        return {
          totalStorage,
          usedStorage,
          availableStorage,
          utilizationPercentage: (usedStorage / totalStorage) * 100,
          estimatedRetention: this.calculateEstimatedRetention()
        };
      }),
      delay(300)
    );
  }

  getUsageHistory(): Observable<StorageUsageRecord[]> {
    return this.usageHistory$.asObservable().pipe(delay(300));
  }

  monitorStorageUsage(): Observable<StorageStatistics> {
    return interval(5000).pipe(
      switchMap(() => this.getStorageStatistics())
    );
  }

  addStorage(storage: Omit<Storage, 'id' | 'createdAt' | 'updatedAt'>): Observable<Storage> {
    const newStorage: Storage = {
      ...storage,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockStorages.push(newStorage);
    this.storages$.next([...this.mockStorages]);
    return of(newStorage).pipe(delay(500));
  }

  updateStorage(id: string, updates: Partial<Storage>): Observable<Storage | undefined> {
    const index = this.mockStorages.findIndex(s => s.id === id);
    if (index === -1) return of(undefined).pipe(delay(300));

    const updated = { ...this.mockStorages[index], ...updates, updatedAt: new Date() };
    this.mockStorages[index] = updated;
    this.storages$.next([...this.mockStorages]);
    return of(updated).pipe(delay(500));
  }

  deleteStorage(id: string): Observable<boolean> {
    const index = this.mockStorages.findIndex(s => s.id === id);
    if (index === -1) return of(false).pipe(delay(300));

    this.mockStorages.splice(index, 1);
    this.storages$.next([...this.mockStorages]);
    return of(true).pipe(delay(500));
  }

  testStorageConnection(storageId: string): Observable<boolean> {
    return of(true).pipe(delay(2000));
  }

  private calculateEstimatedRetention(): number {
    const totalUsed = this.mockStorages.reduce((sum, s) => sum + s.usedCapacity, 0);
    const avgDailyUsage = totalUsed / 30; // Assume 30 days of usage
    const totalAvailable = this.mockStorages.reduce((sum, s) => sum + s.availableCapacity, 0);
    return Math.floor(totalAvailable / avgDailyUsage);
  }

  private generateUsageHistory(): StorageUsageRecord[] {
    const records: StorageUsageRecord[] = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      const totalStorage = this.mockStorages.reduce((sum, s) => sum + s.totalCapacity, 0);
      const baseUsed = this.mockStorages.reduce((sum, s) => sum + s.usedCapacity, 0);
      const variance = (Math.random() - 0.5) * 5 * 1024 * 1024 * 1024 * 1024; // ±2.5 TB variation
      const usedCapacity = baseUsed + variance;

      records.push({
        timestamp,
        usedCapacity,
        availableCapacity: totalStorage - usedCapacity,
        utilizationPercentage: (usedCapacity / totalStorage) * 100
      });
    }

    return records.reverse();
  }
}
