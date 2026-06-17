import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  private readonly mockUsers: Map<string, { password: string; user: User }> = new Map([
    [
      'admin',
      {
        password: 'admin123',
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@vigilance.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['admin'],
          permissions: ['all'],
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      }
    ],
    [
      'operator',
      {
        password: 'operator123',
        user: {
          id: '2',
          username: 'operator',
          email: 'operator@vigilance.com',
          firstName: 'Operator',
          lastName: 'User',
          roles: ['operator'],
          permissions: ['camera:view', 'alert:view', 'alert:acknowledge'],
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      }
    ],
    [
      'viewer',
      {
        password: 'viewer123',
        user: {
          id: '3',
          username: 'viewer',
          email: 'viewer@vigilance.com',
          firstName: 'Viewer',
          lastName: 'User',
          roles: ['viewer'],
          permissions: ['camera:view', 'alert:view'],
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      }
    ]
  ]);

  get authState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(state => state.isAuthenticated));
  }

  get currentUser(): Observable<User | null> {
    return this.authState$.pipe(map(state => state.user));
  }

  constructor() {
    this.loadStoredAuth();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const currentState = this.authState$.getValue();
    this.authState$.next({ ...currentState, loading: true, error: null });

    const mockUser = this.mockUsers.get(request.username);

    if (!mockUser || mockUser.password !== request.password) {
      const error = 'Invalid username or password';
      this.authState$.next({ ...currentState, loading: false, error });
      return throwError(() => new Error(error));
    }

    const response: LoginResponse = {
      token: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      user: mockUser.user,
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(1000),
      tap(res => {
        this.authState$.next({
          isAuthenticated: true,
          user: res.user,
          token: res.token,
          loading: false,
          error: null
        });
        this.storeAuth(res);
      })
    );
  }

  logout(): Observable<void> {
    this.authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return of(void 0);
  }

  register(userData: any): Observable<User> {
    return of(userData).pipe(
      delay(1000),
      map(data => ({
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        roles: ['viewer'],
        permissions: ['camera:view', 'alert:view'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  }

  refreshToken(): Observable<string> {
    const token = `mock-token-${Date.now()}`;
    const currentState = this.authState$.getValue();
    this.authState$.next({ ...currentState, token });
    this.storeAuth({
      token,
      refreshToken: '',
      user: currentState.user!,
      expiresIn: 3600
    });
    return of(token).pipe(delay(500));
  }

  hasPermission(permission: string): boolean {
    const user = this.authState$.getValue().user;
    return user ? user.permissions.includes(permission) || user.permissions.includes('all') : false;
  }

  hasRole(role: string): boolean {
    const user = this.authState$.getValue().user;
    return user ? user.roles.includes(role) : false;
  }

  private storeAuth(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');

    if (token && user) {
      try {
        this.authState$.next({
          isAuthenticated: true,
          user: JSON.parse(user),
          token,
          loading: false,
          error: null
        });
      } catch (e) {
        this.logout();
      }
    }
  }
}
