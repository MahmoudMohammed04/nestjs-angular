import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { FirbaseStrategy } from './jwt/jwt.strategy';
import { FirebaseService } from './jwt/firebaseAdmin';

@Module({
    imports: [
        PrismaModule,
        PassportModule
    ],
    controllers: [AuthController],
    providers: [FirbaseStrategy,AuthService],
})
export class AuthModule {}
