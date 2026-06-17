import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Camera, CameraStatus, HealthStatus, CameraStatistics, CameraStream } from '../models/camera.model';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private mockCameras: Camera[] = [
    {
      id: '1',
      name: 'Front Gate',
      model: 'DS-2CD2143G2-I',
      manufacturer: 'Hikvision',
      ipAddress: '192.168.1.10',
      port: 554,
      username: 'admin',
      location: 'Main Entrance',
      latitude: 40.7128,
      longitude: -74.0060,
      resolution: '2688x1920',
      fps: 30,
      codec: 'H.264',
      status: CameraStatus.ONLINE,
      isRecording: true,
      recordingResolution: '2688x1920',
      recordingFps: 30,
      lastHealthCheck: new Date(),
      healthStatus: HealthStatus.HEALTHY,
      tags: ['entrance', 'critical'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Parking Area',
      model: 'DS-2CD2T43G0-I5',
      manufacturer: 'Hikvision',
      ipAddress: '192.168.1.11',
      port: 554,
      username: 'admin',
      location: 'Parking Lot',
      latitude: 40.7115,
      longitude: -74.0069,
      resolution: '2688x1920',
      fps: 25,
      codec: 'H.264',
      status: CameraStatus.ONLINE,
      isRecording: true,
      recordingResolution: '2688x1920',
      recordingFps: 25,
      lastHealthCheck: new Date(),
      healthStatus: HealthStatus.HEALTHY,
      tags: ['parking', 'surveillance'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Server Room',
      model: 'DS-2CD2125FWD-I',
      manufacturer: 'Hikvision',
      ipAddress: '192.168.1.12',
      port: 554,
      username: 'admin',
      location: 'Data Center',
      latitude: 40.7125,
      longitude: -74.0070,
      resolution: '1920x1080',
      fps: 30,
      codec: 'H.265',
      status: CameraStatus.OFFLINE,
      isRecording: false,
      recordingResolution: '1920x1080',
      recordingFps: 30,
      lastHealthCheck: new Date(Date.now() - 3600000),
      healthStatus: HealthStatus.CRITICAL,
      tags: ['server', 'critical'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Conference Hall',
      model: 'DS-2CD2643G0-IZS',
      manufacturer: 'Hikvision',
      ipAddress: '192.168.1.13',
      port: 554,
      username: 'admin',
      location: 'Building A',
      latitude: 40.7120,
      longitude: -74.0075,
      resolution: '2560x1920',
      fps: 30,
      codec: 'H.264',
      status: CameraStatus.ONLINE,
      isRecording: true,
      recordingResolution: '2560x1920',
      recordingFps: 30,
      lastHealthCheck: new Date(),
      healthStatus: HealthStatus.HEALTHY,
      tags: ['indoor', 'conference'],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Lobby Desk',
      model: 'DS-2CD2723G0-IZS',
      manufacturer: 'Hikvision',
      ipAddress: '192.168.1.14',
      port: 554,
      username: 'admin',
      location: 'Building B Lobby',
      latitude: 40.7110,
      longitude: -74.0080,
      resolution: '1920x1080',
      fps: 30,
      codec: 'H.264',
      status: CameraStatus.ONLINE,
      isRecording: true,
      recordingResolution: '1920x1080',
      recordingFps: 30,
      lastHealthCheck: new Date(),
      healthStatus: HealthStatus.WARNING,
      tags: ['indoor', 'lobby'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date()
    }
  ];

  private cameras$ = new BehaviorSubject<Camera[]>(this.mockCameras);

  constructor() {}

  getAllCameras(): Observable<Camera[]> {
    return this.cameras$.asObservable().pipe(delay(500));
  }

  getCameraById(id: string): Observable<Camera | undefined> {
    return of(this.mockCameras.find(c => c.id === id)).pipe(delay(300));
  }

  getCamerasByStatus(status: CameraStatus): Observable<Camera[]> {
    return of(this.mockCameras.filter(c => c.status === status)).pipe(delay(300));
  }

  getCameraStatistics(): Observable<CameraStatistics> {
    return of(this.mockCameras).pipe(
      map(cameras => ({
        totalCameras: cameras.length,
        onlineCameras: cameras.filter(c => c.status === CameraStatus.ONLINE).length,
        offlineCameras: cameras.filter(c => c.status === CameraStatus.OFFLINE).length,
        recordingCameras: cameras.filter(c => c.isRecording).length,
        averageHealthScore: this.calculateAverageHealth(cameras)
      })),
      delay(300)
    );
  }

  addCamera(camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>): Observable<Camera> {
    const newCamera: Camera = {
      ...camera,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockCameras.push(newCamera);
    this.cameras$.next([...this.mockCameras]);
    return of(newCamera).pipe(delay(500));
  }

  updateCamera(id: string, updates: Partial<Camera>): Observable<Camera | undefined> {
    const index = this.mockCameras.findIndex(c => c.id === id);
    if (index === -1) return of(undefined).pipe(delay(300));

    const updated = { ...this.mockCameras[index], ...updates, updatedAt: new Date() };
    this.mockCameras[index] = updated;
    this.cameras$.next([...this.mockCameras]);
    return of(updated).pipe(delay(500));
  }

  deleteCamera(id: string): Observable<boolean> {
    const index = this.mockCameras.findIndex(c => c.id === id);
    if (index === -1) return of(false).pipe(delay(300));

    this.mockCameras.splice(index, 1);
    this.cameras$.next([...this.mockCameras]);
    return of(true).pipe(delay(500));
  }

  getCameraStream(cameraId: string, quality: 'low' | 'medium' | 'high' | 'ultra' = 'high'): Observable<CameraStream> {
    return of({
      cameraId,
      streamUrl: `rtsp://192.168.1.${parseInt(cameraId) + 9}/stream`,
      protocol: 'rtsp',
      quality,
      bandwidth: quality === 'ultra' ? 5000 : quality === 'high' ? 3000 : quality === 'medium' ? 1500 : 800
    }).pipe(delay(200));
  }

  getHealthStatus(cameraId: string): Observable<HealthStatus> {
    const camera = this.mockCameras.find(c => c.id === cameraId);
    return of(camera?.healthStatus || HealthStatus.UNKNOWN).pipe(delay(300));
  }

  testConnection(ipAddress: string, port: number, username: string, password: string): Observable<boolean> {
    // Simulate connection test
    const isValid = ipAddress && port > 0 && username && password;
    return of(isValid).pipe(delay(1500));
  }

  private calculateAverageHealth(cameras: Camera[]): number {
    const healthScores: { [key: string]: number } = {
      [HealthStatus.HEALTHY]: 100,
      [HealthStatus.WARNING]: 60,
      [HealthStatus.CRITICAL]: 20,
      [HealthStatus.UNKNOWN]: 50
    };

    if (cameras.length === 0) return 0;
    const total = cameras.reduce((sum, c) => sum + healthScores[c.healthStatus], 0);
    return Math.round(total / cameras.length);
  }
}
