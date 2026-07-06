import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseService } from './firebaseAdmin';
import { Request } from 'express';



@Injectable()
export class FirbaseStrategy extends PassportStrategy(Strategy,'firebase') {
 
    constructor(private readonly firebaseService: FirebaseService) {
    super();
  }
  async validate(req: Request) {
    const auth = req.headers.authorization;

    if(!auth?.startsWith('Bearer '))
    {
      throw new UnauthorizedException();
    }

    const token = auth.split(' ')[1];

    try{

      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(token);
      return decodedToken;
    }
    catch{
       throw new UnauthorizedException();
    }
  }
}