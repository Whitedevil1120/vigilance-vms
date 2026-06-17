import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Event, EventType, EventFilter } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private mockEvents: Event[] = [
    {
      id: '1',
      type: EventType.LOGIN,
      description: 'User logged in',
      source: 'AUTH_SERVICE',
      actor: 'admin',
      ipAddress: '192.168.1.100',
      timestamp: new Date(Date.now() - 600000),
      details: { method: 'username_password' }
    },
    {
      id: '2',
      type: EventType.RECORDING_STARTED,
      description: 'Recording started on Front Gate camera',
      source: 'CAMERA_SERVICE',
      targetResource: 'Camera',
      targetResourceId: '1',
      timestamp: new Date(Date.now() - 500000),
      details: { resolution: '2688x1920', fps: 30 }
    },
    {
      id: '3',
      type: EventType.ALERT_TRIGGERED,
      description: 'Motion detection alert triggered',
      source: 'ALERT_SERVICE',
      targetResource: 'Alert',
      targetResourceId: '1',
      timestamp: new Date(Date.now() - 300000),
      details: { alertType: 'MOTION_DETECTION', severity: 'WARNING' }
    },
    {
      id: '4',
      type: EventType.CONFIGURATION_CHANGED,
      description: 'Camera configuration updated',
      source: 'CAMERA_SERVICE',
      actor: 'admin',
      targetResource: 'Camera',
      targetResourceId: '2',
      timestamp: new Date(Date.now() - 200000),
      details: { field: 'fps', oldValue: 25, newValue: 30 }
    },
    {
      id: '5',
      type: EventType.ALERT_ACKNOWLEDGED,
      description: 'Alert acknowledged by operator',
      source: 'ALERT_SERVICE',
      actor: 'operator',
      targetResource: 'Alert',
      targetResourceId: '4',
      timestamp: new Date(Date.now() - 100000),
      details: { message: 'Investigating unauthorized access attempt' }
    },
    {
      id: '6',
      type: EventType.ROLE_ASSIGNED,
      description: 'Admin role assigned to user',
      source: 'USER_SERVICE',
      actor: 'admin',
      targetResource: 'User',
      targetResourceId: '5',
      timestamp: new Date(Date.now() - 50000),
      details: { role: 'admin', previousRole: 'operator' }
    },
    {
      id: '7',
      type: EventType.SYSTEM_ERROR,
      description: 'Storage device connection error',
      source: 'STORAGE_SERVICE',
      timestamp: new Date(Date.now() - 25000),
      details: { deviceId: 'storage-1', errorCode: 'CONN_TIMEOUT' }
    }
  ];

  private events$ = new BehaviorSubject<Event[]>(this.mockEvents);

  constructor() {}

  getAllEvents(filter?: EventFilter): Observable<Event[]> {
    let filtered = [...this.mockEvents];

    if (filter) {
      if (filter.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filter.endDate!);
      }
      if (filter.type) {
        filtered = filtered.filter(e => e.type === filter.type);
      }
      if (filter.actor) {
        filtered = filtered.filter(e => e.actor === filter.actor);
      }
      if (filter.source) {
        filtered = filtered.filter(e => e.source === filter.source);
      }
    }

    return of(filtered).pipe(delay(300));
  }

  getEventById(id: string): Observable<Event | undefined> {
    return of(this.mockEvents.find(e => e.id === id)).pipe(delay(200));
  }

  getEventsByType(type: EventType): Observable<Event[]> {
    return of(this.mockEvents.filter(e => e.type === type)).pipe(delay(300));
  }

  getEventsByActor(actor: string): Observable<Event[]> {
    return of(this.mockEvents.filter(e => e.actor === actor)).pipe(delay(300));
  }

  getRecentEvents(limit: number = 10): Observable<Event[]> {
    return of(this.mockEvents.slice(0, limit)).pipe(delay(300));
  }

  logEvent(event: Omit<Event, 'id'>): Observable<Event> {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.mockEvents.unshift(newEvent);
    this.events$.next([...this.mockEvents]);
    return of(newEvent).pipe(delay(300));
  }

  exportEvents(filter?: EventFilter): Observable<string> {
    // Returns CSV format
    return this.getAllEvents(filter).pipe(
      delay(1000),
      map(events => {
        const headers = ['ID', 'Type', 'Description', 'Source', 'Actor', 'Timestamp'];
        const rows = events.map(e => [
          e.id,
          e.type,
          e.description,
          e.source,
          e.actor || '-',
          e.timestamp.toISOString()
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      })
    );
  }
}

import { map } from 'rxjs/operators';
