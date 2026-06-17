export interface Camera {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  ipAddress: string;
  port: number;
  username: string;
  password?: string;
  location: string;
  latitude: number;
  longitude: number;
  resolution: string;
  fps: number;
  codec: string;
  status: CameraStatus;
  isRecording: boolean;
  recordingResolution: string;
  recordingFps: number;
  lastHealthCheck: Date;
  healthStatus: HealthStatus;
  groupId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CameraStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  DISABLED = 'disabled'
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

export interface CameraGroup {
  id: string;
  name: string;
  description: string;
  cameras: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CameraStatistics {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  recordingCameras: number;
  averageHealthScore: number;
}

export interface CameraStream {
  cameraId: string;
  streamUrl: string;
  protocol: 'rtsp' | 'http' | 'hls' | 'webrtc';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  bandwidth?: number;
}