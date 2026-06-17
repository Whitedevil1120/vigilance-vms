export interface Storage {
  id: string;
  name: string;
  type: StorageType;
  location: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  status: StorageStatus;
  healthScore: number;
  lastHealthCheck: Date;
  cameras: string[];
  retentionDays: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum StorageType {
  LOCAL = 'local',
  NETWORK = 'network',
  CLOUD = 'cloud',
  HYBRID = 'hybrid'
}

export enum StorageStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  DEGRADED = 'degraded',
  FULL = 'full',
  ERROR = 'error'
}

export interface StorageStatistics {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  utilizationPercentage: number;
  estimatedRetention: number;
}

export interface StoragePolicy {
  id: string;
  name: string;
  description: string;
  retentionDays: number;
  archiveAfterDays: number;
  deleteAfterDays: number;
  compressionEnabled: boolean;
  redundancyLevel: 'none' | 'single' | 'double' | 'triple';
}

export interface StorageUsageRecord {
  timestamp: Date;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
}