import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './Firebase.service';
import { map } from 'rxjs';

export const firebaseGuard: CanActivateFn = () => {
  const auth = inject(FirebaseService);
  const router = inject(Router);

  return auth.user$.pipe(
    map(user => {
      if (user) return true;

      router.navigate(['/Authentication/Login']);
      return false;
    })
  );
};