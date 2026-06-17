import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Alert, AlertStatus, AlertType, AlertSeverity, AlertSource } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private mockAlerts: Alert[] = [
    {
      id: '1',
      title: 'Motion Detected - Front Gate',
      description: 'Motion detected in high-security zone at main entrance',
      type: AlertType.MOTION_DETECTION,
      severity: AlertSeverity.WARNING,
      source: AlertSource.CAMERA,
      cameraIds: ['1'],
      status: AlertStatus.NEW,
      createdAt: new Date(Date.now() - 300000),
      updatedAt: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      title: 'Camera Offline - Server Room',
      description: 'Server room camera has been offline for 30 minutes',
      type: AlertType.CAMERA_OFFLINE,
      severity: AlertSeverity.CRITICAL,
      source: AlertSource.SYSTEM,
      cameraIds: ['3'],
      status: AlertStatus.NEW,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      title: 'Storage Usage Critical',
      description: 'Storage utilization has reached 95% capacity',
      type: AlertType.STORAGE_FULL,
      severity: AlertSeverity.CRITICAL,
      source: AlertSource.SYSTEM,
      cameraIds: [],
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedBy: 'admin',
      acknowledgedAt: new Date(Date.now() - 600000),
      createdAt: new Date(Date.now() - 1200000),
      updatedAt: new Date(Date.now() - 600000)
    },
    {
      id: '4',
      title: 'Unauthorized Access Attempt',
      description: 'Failed authentication attempts detected from IP 203.0.113.45',
      type: AlertType.UNAUTHORIZED_ACCESS,
      severity: AlertSeverity.CRITICAL,
      source: AlertSource.SYSTEM,
      cameraIds: [],
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedBy: 'admin',
      acknowledgedAt: new Date(Date.now() - 300000),
      createdAt: new Date(Date.now() - 900000),
      updatedAt: new Date(Date.now() - 300000)
    },
    {
      id: '5',
      title: 'Network Connection Issue',
      description: 'High latency detected on network segment A',
      type: AlertType.NETWORK_ISSUE,
      severity: AlertSeverity.WARNING,
      source: AlertSource.SYSTEM,
      cameraIds: ['4', '5'],
      status: AlertStatus.RESOLVED,
      resolvedBy: 'operator',
      resolvedAt: new Date(Date.now() - 150000),
      createdAt: new Date(Date.now() - 2400000),
      updatedAt: new Date(Date.now() - 150000)
    }
  ];

  private alerts$ = new BehaviorSubject<Alert[]>(this.mockAlerts);
  private newAlerts$ = new Subject<Alert>();

  constructor() {
    // Simulate incoming alerts every 30 seconds
    setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = this.generateRandomAlert();
        this.mockAlerts.unshift(newAlert);
        this.alerts$.next([...this.mockAlerts]);
        this.newAlerts$.next(newAlert);
      }
    }, 30000);
  }

  getAllAlerts(): Observable<Alert[]> {
    return this.alerts$.asObservable().pipe(delay(300));
  }

  getAlertsByStatus(status: AlertStatus): Observable<Alert[]> {
    return of(this.mockAlerts.filter(a => a.status === status)).pipe(delay(300));
  }

  getAlertsBySeverity(severity: AlertSeverity): Observable<Alert[]> {
    return of(this.mockAlerts.filter(a => a.severity === severity)).pipe(delay(300));
  }

  getNewAlerts(): Observable<Alert> {
    return this.newAlerts$.asObservable();
  }

  getAlertCount(): Observable<{ new: number; acknowledged: number; resolved: number }> {
    return of(this.mockAlerts).pipe(
      map(alerts => ({
        new: alerts.filter(a => a.status === AlertStatus.NEW).length,
        acknowledged: alerts.filter(a => a.status === AlertStatus.ACKNOWLEDGED).length,
        resolved: alerts.filter(a => a.status === AlertStatus.RESOLVED).length
      })),
      delay(300)
    );
  }

  acknowledgeAlert(id: string, userId: string): Observable<Alert | undefined> {
    const alert = this.mockAlerts.find(a => a.id === id);
    if (!alert) return of(undefined).pipe(delay(300));

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    alert.updatedAt = new Date();

    this.alerts$.next([...this.mockAlerts]);
    return of(alert).pipe(delay(300));
  }

  resolveAlert(id: string, userId: string): Observable<Alert | undefined> {
    const alert = this.mockAlerts.find(a => a.id === id);
    if (!alert) return of(undefined).pipe(delay(300));

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();
    alert.updatedAt = new Date();

    this.alerts$.next([...this.mockAlerts]);
    return of(alert).pipe(delay(300));
  }

  escalateAlert(id: string): Observable<Alert | undefined> {
    const alert = this.mockAlerts.find(a => a.id === id);
    if (!alert) return of(undefined).pipe(delay(300));

    alert.status = AlertStatus.ESCALATED;
    alert.severity = AlertSeverity.CRITICAL;
    alert.updatedAt = new Date();

    this.alerts$.next([...this.mockAlerts]);
    return of(alert).pipe(delay(300));
  }

  createAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>): Observable<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockAlerts.unshift(newAlert);
    this.alerts$.next([...this.mockAlerts]);
    return of(newAlert).pipe(delay(500));
  }

  private generateRandomAlert(): Alert {
    const types = Object.values(AlertType);
    const severities = [AlertSeverity.INFO, AlertSeverity.WARNING];
    const cameras = ['1', '2', '4', '5'];

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `Auto-generated Alert - ${types[Math.floor(Math.random() * types.length)]}`,
      description: 'This is an auto-generated alert for demonstration',
      type: types[Math.floor(Math.random() * types.length)] as AlertType,
      severity: severities[Math.floor(Math.random() * severities.length)],
      source: AlertSource.SYSTEM,
      cameraIds: [cameras[Math.floor(Math.random() * cameras.length)]],
      status: AlertStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
