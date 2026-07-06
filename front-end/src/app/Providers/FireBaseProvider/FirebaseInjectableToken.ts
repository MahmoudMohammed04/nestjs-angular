import {  InjectionToken } from "@angular/core";
import { firebaseConfig } from "./FireBaseConfig";

export const FIREBASE_CONFIG = new InjectionToken<firebaseConfig>('FIREBASE_CONFIG');