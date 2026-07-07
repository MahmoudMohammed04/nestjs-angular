import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from 'src/auth/jwt/firebaseAdmin';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/prisma/prisma.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService ,
    private readonly firebaseService: FirebaseService,
    private readonly prismaService: PrismaService){}

   async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);

      client.data.userId = decoded.uid; 

      console.log(client.id + ' ' + client.data.userId);

      client.join(`user${client.data.userId}`);
    } catch {
      client.disconnect();
    }
  }


@SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId: number; content: string },
  ) {

    console.log(data+' '+client.data.userId+ " twice");

    const senderId = client.data.userId;

    const result = await this.messageService.sendMesssage(
      senderId,
      data.conversationId,
      data.content,
    );

    result.conversation.members.map((member) => {
      if(member.userId === senderId) return
      this.server
        .to(`user${member.userId}`)
        .emit('messageReceived', result.message);
    })
   

    return result.message;
  }

 
  @SubscribeMessage('deliverMessage')
  async handleDeliverMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: number },
  ) {
    const userId = client.data.userId;

    const result = await this.messageService.deliverMessage(
      data.messageId,
      userId,
    );
    
    console.log(result);
    if(result.conversationMembersCount === result.deliveredCount)
    this.server.to(`user${result.senderId}`).emit('messageDelivered', result);

 
  }


  @SubscribeMessage('seenMessage')
  async handleSeenMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: number },
  ) {
    const userId = client.data.userId;

    const result = await this.messageService.seenMessage(
      data.messageId,
      userId,
    );

    if(result.conversationMembersCount === result.readCount)
      this.server.to(`user${result.senderId}`).emit('messageSeen', result);
 
  }


}
