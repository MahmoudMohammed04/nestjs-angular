import { EnvironmentProviders , makeEnvironmentProviders } from "@angular/core";
import { API_CONFIG, APIConfig } from "./apiConfig";
import { ApiService } from "./apiService.service";

export function provideAPI(config : APIConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: API_CONFIG,
            useValue: config
        },
        ApiService
    ]);
}