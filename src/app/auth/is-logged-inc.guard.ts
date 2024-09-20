import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../Services/usuario.service';
import { Router } from '@angular/router';

export const isLoggedIncGuard: CanMatchFn = (route, segments) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado. Aquí usas una propiedad como ejemplo
  const isLoggedIn = !!localStorage.getItem('token'); // Puedes usar un token o indicador que guardes en localStorage

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']); // Redirige a la página de login si no está autenticado
    return false;
  }
};
