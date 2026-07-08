import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseService } from 'src/auth/jwt/firebaseAdmin';
import { MessagingGateway } from 'src/messaging/messaging.gateway';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [PrismaModule,MessagingModule],
  providers: [ConversationService],
  controllers: [ConversationController]
})
export class ConversationModule {}
 