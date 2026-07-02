import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createGroupDto } from './dto/createConversation.dto';

@Injectable()
export class ConversationService {

    constructor(private readonly prisma : PrismaService) {}


    async getConversationData(conversationId: number,isGroup: boolean) {
        
        
        if(isGroup) {
            return await this.prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                }
            })
        }
        return await this.prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                members: true,
            }
        })
    }
    async checkConversationOneToOneExist(senderId: string, receiverId: string) {
        const existingConversation = await this.prisma.conversation.findFirst({
          where: {
            isGroup: false,
            AND: [
              {
                members: {
                  some: {
                    userId: senderId,
                  },
                },
              },
              {
                members: {
                  some: {
                    userId: receiverId,
                  },
                },
              },
              {
                membersCount: 2,
              },
            ],
          },
        });

        return existingConversation;
    }

    async createConversationOneToOne(senderId: string, receiverId: string) {

        
        const existingConversation = await this.checkConversationOneToOneExist(senderId, receiverId);

        if (existingConversation) {
          return existingConversation;
        }

        const conversation = await this.prisma.conversation.create({
            data: {
                isGroup: false,
                membersCount: 2,
            }
        })

        const members = await this.prisma.conversationMember.createMany({
            data: [
                { conversationId: conversation.id, userId: senderId },
                { conversationId: conversation.id, userId: receiverId },
            ]
        })
        return conversation;
    }

    async createConversationGroup(senderId: string,dto:createGroupDto) {
        const conversation = await this.prisma.conversation.create({
            data: {
                isGroup: true,
                name: dto.name,
                membersCount: dto.receiversId.length+1,
            }
        })
        const members = await this.prisma.conversationMember.createMany({
            data: [
                { conversationId: conversation.id, userId: senderId ,role:"owner"},
                ...dto.receiversId.map(receiverId => ({ conversationId: conversation.id, userId: receiverId })),
            ]
        })
        return conversation;
    }

    async getConversationByUserId(userId: string) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
        });
        return conversations;
    }

    
}
