import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  return auth.isAuth().pipe(
    //efectos secundarios
    tap(estado => {
      if(!estado){router.navigate(['/login'])}
    })
  );
};
