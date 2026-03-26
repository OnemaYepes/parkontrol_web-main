import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { RolUsuario } from '../models/shared.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const usuario = authService.getUsuarioActual();
    
    if (!usuario?.rol || (usuario.rol !== RolUsuario.ADMINISTRADOR && usuario.rol !== RolUsuario.OPERADOR)) {
      authService.logout();
      alert('Acceso denegado Rol diferente de ADMINISTRADOR u OPERADOR.');
      return router.createUrlTree(['/login']);
    }
    
    if (state.url === '/' || state.url === '') {
      if (usuario.rol === RolUsuario.ADMINISTRADOR) {
        return router.createUrlTree(['/dashboard']);
      } else if (usuario.rol === RolUsuario.OPERADOR) {
        return router.createUrlTree(['/parqueaderos']);
      }
    }
    
    return true;
  }
  return router.createUrlTree(['/login']);
};