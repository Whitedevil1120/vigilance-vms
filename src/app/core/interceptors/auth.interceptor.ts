import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authentication token to requests
    const authState = this.authService['authState$'].getValue();
    
    if (authState.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authState.token}`
        }
      });
    }

    // Add common headers
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Handle successful responses if needed
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - token might be expired
          this.authService.logout().subscribe(() => {
            this.notificationService.error('Session Expired', 'Your session has expired. Please log in again.');
            window.location.href = '/auth/login';
          });
        } else if (error.status === 403) {
          this.notificationService.error('Access Denied', 'You do not have permission to access this resource.');
        } else if (error.status === 500) {
          this.notificationService.error('Server Error', 'An internal server error occurred. Please try again later.');
        } else if (error.status === 0) {
          this.notificationService.error('Network Error', 'Unable to connect to the server. Please check your connection.');
        }

        return throwError(() => error);
      })
    );
  }
}
