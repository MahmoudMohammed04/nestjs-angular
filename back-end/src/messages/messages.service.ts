import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma : PrismaService) {}

    async sendMesssage(senderId: string, conversationId: number, content: string,file?:File) {

        const conversation = await this.prisma.conversation.findUnique({
            where:{id:conversationId},
            include:{members:true}
        });

        if(!conversation) throw new BadRequestException('Conversation does not exist');

        return this.prisma.$transaction(async (tx) => {

            const message = await tx.message.create({
                data: {
                    senderId: senderId,
                    conversationId: conversationId,
                    content: content,
                    conversationMembersCount: conversation.membersCount-1,
                    sentAt: new Date(),
                }
            });

            await tx.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    lastMessageId: message.id,
                    lastMessageTime: new Date(),
                },
            })

            await tx.messageStatus.createMany({
                data: conversation.members.map(member => ({
                    messageId: message.id,
                    userId: member.userId,
                    status: 'None',
                }))
            })

            return {message , conversation};
        })
    }

    async deliverMessage(messageId: number, userId: string) {
      return this.prisma.$transaction(async (tx) => {

        const message = await tx.message.findUnique({
          where: { id: messageId }
        });

        if (!message) {
          throw new BadRequestException('Message not found');
        }
        
        const conversationMemebrStatus = await tx.conversationMember.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: message.conversationId,
                },
            }
        })

        if(!conversationMemebrStatus) throw new BadRequestException('Conversation member does not exist');

        await tx.messageStatus.updateMany({
          where: {
            userId,
            status: 'None',
            messages: {
              conversationId: message.conversationId,
              id: {
                gt: conversationMemebrStatus.lastDeliveredMessageId ?? 0,
                lte: messageId,
              },
            },
          },
          data: {
            status: 'delivered',
          },
        })

        await tx.conversationMember.update({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: message.conversationId,
                },
            },
            data: {
                lastDeliveredMessageId: messageId,
            },
        
        });  

        return {
            ...message,
            deliveredCount: await tx.messageStatus.count({
                where: {
                    messageId,
                    status: 'delivered',
                },
            }),
            readCount: await tx.messageStatus.count({
                where: {
                    messageId,
                    status: 'Seen',
                },
            }),
        };
    })
    }

    async seenMessage(messageId: number, userId: string) {
      return this.prisma.$transaction(async (tx) => {

        const message = await tx.message.findUnique({
          where: { id: messageId }
        });

        if (!message) {
          throw new BadRequestException('Message not found');
        }
        
        const conversationMemebrStatus = await tx.conversationMember.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: message.conversationId,
                },
            }
        })

        if(!conversationMemebrStatus) throw new BadRequestException('Conversation member does not exist');

        await tx.messageStatus.updateMany({
          where: {
            userId,
            status: { in: ['None', 'delivered'] },
            messages: {
              conversationId: message.conversationId,
              id: {
                gt: conversationMemebrStatus.lastReadedMessageId ?? 0,
                lte: messageId,
              },
            },
          },
          data: {
            status: 'Seen',
          },
        })

        await tx.conversationMember.update({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId: message.conversationId,
                },
            },
            data: {
                lastReadedMessageId: messageId,
                lastDeliveredMessageId: messageId,
            },
        
        });  

        return {
            ...message,
            deliveredCount: await tx.messageStatus.count({
                where: {
                    messageId,
                    status: 'delivered',
                },
            }),
            readCount: await tx.messageStatus.count({
                where: {
                    messageId,
                    status: 'Seen',
                },
            }),
        };
    })
    }
    
}
