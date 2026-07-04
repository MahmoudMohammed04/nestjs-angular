import { EnvironmentProviders , makeEnvironmentProviders } from "@angular/core";
import { firebaseConfig } from "./FireBaseConfig";
import { FirebaseService } from "./Firebase.service";
import { FIREBASE_CONFIG } from "./FirebaseInjectableToken";
export function provideFirebase(config : firebaseConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: FIREBASE_CONFIG,
            useValue: config
        },
        FirebaseService
    ]);
}