import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideFirebase } from './FireBaseProvider/FirebaseProvider';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firebaseInterceptor } from './FireBaseProvider/FirebaseInterceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebase(environment.firebase),
    provideHttpClient(
      withInterceptors([firebaseInterceptor])
    )
  ]
};
