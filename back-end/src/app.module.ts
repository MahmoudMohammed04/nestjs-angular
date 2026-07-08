import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversation/conversation.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessagingGateway } from './messaging/messaging.gateway';
import { MessagesModule } from './messages/messages.module';
import { MessagingController } from './messaging/messaging.controller';
import { MessagingModule } from './messaging/messaging.module';
import { FirebaseService } from './auth/jwt/firebaseAdmin';
import { FirebaseModule } from './auth/jwt/firebase.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname,'..','uploads'),
        serveRoot: '/uploads'
      }), 
    
  PrismaModule,AuthModule, ConversationModule, MessagesModule, MessagingModule,FirebaseModule, UserModule],
  providers: [PrismaService, AppService],
  
})
export class AppModule {}
