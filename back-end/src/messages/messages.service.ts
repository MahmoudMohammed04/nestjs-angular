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
                    deliveredCount: 0,
                    readCount: 0,
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

    async deliverMessage(messageId: number,userId: string) {
        return this.prisma.$transaction(async (tx) => {

            const message = await tx.message.update({
                where: {
                    id: messageId,
                },
                data: {
                    deliveredCount: {
                        increment: 1,
                    },
                }
            })

           
            await tx.messageStatus.update({
                where: {
                    messageId_userId: {
                        messageId: messageId,
                        userId: userId
                    }
                },
                data: {
                    status: 'delivered',
                }
            })

            await tx.conversationMember.update({
                where: {
                    userId_conversationId: {
                        userId: userId,
                        conversationId: message.conversationId
                    }
                },
                data: {
                    lastDeliveredMessageId: message.id,
                }
            })

            return message
        })
    }

    async seenMessage(messageId: number,userId: string) {
        return this.prisma.$transaction(async (tx) => {

            const message = await tx.message.update({
                where: {
                    id: messageId,
                },
                data: {
                    readCount: {
                        increment: 1,
                    },
                }
            })

        
            await tx.messageStatus.update({
                where: {
                    messageId_userId: {
                        messageId: messageId,
                        userId: userId
                    }
                },
                data: {
                    status: 'Seen',
                }
            })

            await tx.conversationMember.update({
                where: {
                    userId_conversationId: {
                        userId: userId,
                        conversationId: message.conversationId
                    }
                },
                data: {
                    lastReadedMessageId: message.id,
                }
            })

            return message
        })
    }
}
