import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const state = this.authService['authState$'].getValue();

    if (state.user && requiredRoles.some(role => state.user!.roles.includes(role))) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  return authService['authState$'].pipe(
    take(1),
    map(authState => {
      if (!authState.user) {
        router.navigate(['/auth/login']);
        return false;
      }

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.some(role => authState.user!.roles.includes(role));
        if (!hasRole) {
          router.navigate(['/unauthorized']);
          return false;
        }
      }

      return true;
    })
  );
};
