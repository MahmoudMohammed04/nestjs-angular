import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';



@Injectable()
export class FirebaseService {
  constructor(private config: ConfigService) {
    if(!admin.getApps().length)
    admin.initializeApp({
      credential: admin.cert({
        projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.config
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      }),
    });
  }

  getAuth() {
    return getAuth(admin.getApp());
  }
}

