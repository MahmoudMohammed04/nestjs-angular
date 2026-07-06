import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideFirebase } from './Providers/FireBaseProvider/FirebaseProvider';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firebaseInterceptor } from './Providers/FireBaseProvider/FirebaseInterceptor';
import { provideAPI } from './Providers/APIProvider/apiProvider';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebase(environment.firebase),
    provideHttpClient(
      withInterceptors([firebaseInterceptor])
    ),
    provideAPI(environment.apiDomain)
  ]
};
