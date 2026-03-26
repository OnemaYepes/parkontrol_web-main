import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { RolUsuario } from '../models/shared.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = route.data['roles'] as RolUsuario[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const currentUser = authService.getUsuarioActual();
  
  if (currentUser) {
    if (requiredRoles.includes(currentUser.rol)) {
      return true;
    }
  }

  alert('No tienes permisos para acceder a esta pagina.');
  authService.logout();
  return router.createUrlTree(['/login']);
};