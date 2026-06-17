export interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  source: AlertSource;
  cameraIds: string[];
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export enum AlertType {
  MOTION_DETECTION = 'motion_detection',
  INTRUSION = 'intrusion',
  CAMERA_OFFLINE = 'camera_offline',
  RECORDING_FAILED = 'recording_failed',
  STORAGE_FULL = 'storage_full',
  NETWORK_ISSUE = 'network_issue',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SYSTEM_ERROR = 'system_error',
  CUSTOM = 'custom'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export enum AlertSource {
  SYSTEM = 'system',
  CAMERA = 'camera',
  USER = 'user',
  ANALYTICS = 'analytics'
}

export enum AlertStatus {
  NEW = 'new',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated'
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  actions: AlertAction[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  type: string;
  threshold?: number;
  duration?: number;
  cameraIds?: string[];
}

export interface AlertAction {
  type: 'notification' | 'email' | 'sms' | 'webhook';
  target: string;
  template?: string;
}