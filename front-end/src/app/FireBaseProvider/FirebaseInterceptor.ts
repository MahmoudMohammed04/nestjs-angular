import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { FirebaseService } from './Firebase.service';
import { switchMap, from } from 'rxjs';

export const firebaseInterceptor: HttpInterceptorFn = (req, next) => {
  const firebaseService = inject(FirebaseService);

  return from(firebaseService.getToken()).pipe(
    switchMap(token => {
      const authReq = token
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          })
        : req;

      return next(authReq);
    })
  );
};