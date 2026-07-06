export interface APIConfig{
    domain: string
}

import {  InjectionToken } from "@angular/core";

export const API_CONFIG = new InjectionToken<APIConfig>('API_CONFIG');