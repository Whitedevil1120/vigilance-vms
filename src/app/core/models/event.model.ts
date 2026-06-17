export interface Event {
  id: string;
  type: EventType;
  description: string;
  source: string;
  actor?: string;
  targetResource?: string;
  targetResourceId?: string;
  ipAddress?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export enum EventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PERMISSION_DENIED = 'permission_denied',
  CONFIGURATION_CHANGED = 'configuration_changed',
  RECORDING_STARTED = 'recording_started',
  RECORDING_STOPPED = 'recording_stopped',
  ALERT_TRIGGERED = 'alert_triggered',
  ALERT_ACKNOWLEDGED = 'alert_acknowledged',
  USER_CREATED = 'user_created',
  USER_DELETED = 'user_deleted',
  ROLE_ASSIGNED = 'role_assigned',
  SYSTEM_ERROR = 'system_error'
}

export interface EventFilter {
  startDate?: Date;
  endDate?: Date;
  type?: EventType;
  actor?: string;
  source?: string;
  severity?: 'info' | 'warning' | 'error';
}