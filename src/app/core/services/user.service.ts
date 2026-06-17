import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserProfile, UserCreateRequest, UserUpdateRequest, PasswordChangeRequest, UserActivity } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: UserProfile[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@vigilance.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1-555-0001',
      department: 'Administration',
      role: 'admin',
      roles: ['admin'],
      permissions: ['all'],
      isActive: true,
      lastLogin: new Date(Date.now() - 600000),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      username: 'operator',
      email: 'operator@vigilance.com',
      firstName: 'Operator',
      lastName: 'User',
      phone: '+1-555-0002',
      department: 'Operations',
      role: 'operator',
      roles: ['operator'],
      permissions: ['camera:view', 'alert:view', 'alert:acknowledge'],
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000),
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date()
    },
    {
      id: '3',
      username: 'viewer',
      email: 'viewer@vigilance.com',
      firstName: 'Viewer',
      lastName: 'User',
      phone: '+1-555-0003',
      department: 'Security',
      role: 'viewer',
      roles: ['viewer'],
      permissions: ['camera:view', 'alert:view'],
      isActive: true,
      lastLogin: new Date(Date.now() - 7200000),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date()
    },
    {
      id: '4',
      username: 'manager',
      email: 'manager@vigilance.com',
      firstName: 'Manager',
      lastName: 'User',
      phone: '+1-555-0004',
      department: 'Management',
      role: 'manager',
      roles: ['manager'],
      permissions: ['camera:view', 'alert:view', 'user:manage', 'analytics:view'],
      isActive: true,
      lastLogin: new Date(Date.now() - 1800000),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    }
  ];

  private mockActivities: UserActivity[] = [
    {
      id: '1',
      userId: '1',
      action: 'LOGIN',
      resource: 'Authentication',
      timestamp: new Date(Date.now() - 600000),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: '2',
      userId: '2',
      action: 'VIEW_CAMERA',
      resource: 'Camera',
      timestamp: new Date(Date.now() - 300000),
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: '3',
      userId: '1',
      action: 'UPDATE_CAMERA',
      resource: 'Camera',
      timestamp: new Date(Date.now() - 150000),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    }
  ];

  private users$ = new BehaviorSubject<UserProfile[]>(this.mockUsers);
  private activities$ = new BehaviorSubject<UserActivity[]>(this.mockActivities);

  constructor() {}

  getAllUsers(): Observable<UserProfile[]> {
    return this.users$.asObservable().pipe(delay(300));
  }

  getUserById(id: string): Observable<UserProfile | undefined> {
    return of(this.mockUsers.find(u => u.id === id)).pipe(delay(300));
  }

  getUserByUsername(username: string): Observable<UserProfile | undefined> {
    return of(this.mockUsers.find(u => u.username === username)).pipe(delay(300));
  }

  getUsersByRole(role: string): Observable<UserProfile[]> {
    return of(this.mockUsers.filter(u => u.roles.includes(role))).pipe(delay(300));
  }

  createUser(request: UserCreateRequest): Observable<UserProfile> {
    const newUser: UserProfile = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      role: request.roles[0],
      profileImage: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockUsers.push(newUser);
    this.users$.next([...this.mockUsers]);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, request: UserUpdateRequest): Observable<UserProfile | undefined> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) return of(undefined).pipe(delay(300));

    const updated = { ...this.mockUsers[index], ...request, updatedAt: new Date() };
    this.mockUsers[index] = updated;
    this.users$.next([...this.mockUsers]);
    return of(updated).pipe(delay(500));
  }

  deleteUser(id: string): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) return of(false).pipe(delay(300));

    this.mockUsers.splice(index, 1);
    this.users$.next([...this.mockUsers]);
    return of(true).pipe(delay(500));
  }

  changePassword(userId: string, request: PasswordChangeRequest): Observable<boolean> {
    // In real app, validate current password
    return of(request.newPassword === request.confirmPassword).pipe(delay(1000));
  }

  getUserActivity(userId: string): Observable<UserActivity[]> {
    return of(this.mockActivities.filter(a => a.userId === userId)).pipe(delay(300));
  }

  getAllActivities(): Observable<UserActivity[]> {
    return this.activities$.asObservable().pipe(delay(300));
  }

  logActivity(activity: Omit<UserActivity, 'id'>): Observable<UserActivity> {
    const newActivity: UserActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.mockActivities.push(newActivity);
    this.activities$.next([...this.mockActivities]);
    return of(newActivity).pipe(delay(300));
  }
}
