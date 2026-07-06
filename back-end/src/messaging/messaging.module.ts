import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { FirebaseService } from 'src/auth/jwt/firebaseAdmin';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
    imports: [],
    providers: [MessagesService,MessagingGateway,FirebaseService,PrismaService],
})
export class MessagingModule {}
