import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationAdded$ = new Subject<Notification>();

  get notifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  get notificationAdded(): Observable<Notification> {
    return this.notificationAdded$.asObservable();
  }

  constructor(private snackBar: MatSnackBar, private ngZone: NgZone) {}

  success(title: string, message: string, duration: number = 5000): void {
    this.notify({ title, message, type: 'success', duration });
    this.showSnackBar(message, 'success', duration);
  }

  error(title: string, message: string, duration: number = 7000): void {
    this.notify({ title, message, type: 'error', duration });
    this.showSnackBar(message, 'error', duration);
  }

  warning(title: string, message: string, duration: number = 6000): void {
    this.notify({ title, message, type: 'warning', duration });
    this.showSnackBar(message, 'warning', duration);
  }

  info(title: string, message: string, duration: number = 5000): void {
    this.notify({ title, message, type: 'info', duration });
    this.showSnackBar(message, 'info', duration);
  }

  private notify(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    const notifications = this.notifications$.getValue();
    this.notifications$.next([...notifications, newNotification]);
    this.notificationAdded$.next(newNotification);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        const updatedNotifications = this.notifications$.getValue();
        this.notifications$.next(updatedNotifications.filter(n => n.id !== newNotification.id));
      }, notification.duration);
    }
  }

  clearNotification(id: string): void {
    const notifications = this.notifications$.getValue();
    this.notifications$.next(notifications.filter(n => n.id !== id));
  }

  clearAllNotifications(): void {
    this.notifications$.next([]);
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number): void {
    this.ngZone.run(() => {
      const config: MatSnackBarConfig = {
        duration,
        panelClass: [`snackbar-${type}`],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      };
      this.snackBar.open(message, 'Close', config);
    });
  }
}
