import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createGroupDto } from './dto/createConversation.dto';

@Injectable()
export class ConversationService {

    constructor(private readonly prisma : PrismaService) {}


   
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
        
        if (senderId === receiverId) {
          throw new BadRequestException();
        }
        
        console.log(senderId, receiverId);
        
        const existingConversation = await this.checkConversationOneToOneExist(senderId, receiverId);

        if (existingConversation) {
          return existingConversation;
        }

        return this.prisma.$transaction(async (tx) => {
          const conversation = await tx.conversation.create({
            data: {
              isGroup: false,
              membersCount: 2,
            },
          });
      
          await tx.conversationMember.createMany({
            data: [
              { conversationId: conversation.id, userId: senderId },
              { conversationId: conversation.id, userId: receiverId },
            ],
          });
      
          return conversation;
        });
    }

    async createConversationGroup(senderId: string,dto:createGroupDto) {

        return this.prisma.$transaction(async (tx) => {
            const conversation = await tx.conversation.create({
                data: {
                    isGroup: true,
                    name: dto.name,
                    membersCount: dto.receiversId.length+1,
                }
            })
            const receivers = [...new Set(dto.receiversId)];
            const members = await tx.conversationMember.createMany({
                data: [
                    { conversationId: conversation.id, userId: senderId ,role:"owner"},
                    ...receivers.map(receiverId => ({ conversationId: conversation.id, userId: receiverId })),
                ]
            })
            return conversation;
        });
    }

    async getConversationsByUserId(userId: string) {

    const conversations = await this.prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },

      orderBy: {
        lastMessageTime: 'desc',
      },

      include: {
        lastMessage: {
          select: {
            content: true,
          },
        },

        members: {
          select: {
            userId: true,

            lastReadedMessageId: true,

            user: {
              select: {
                id: true,
                username: true,
                pictureUrl: true,
              },
            },
          },
        },
      },
    });


    const result = await Promise.all(
      conversations.map(async (conversation) => {

        const currentMember = conversation.members.find(
          member => member.userId === userId
        );


        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,

            id: {
              gt: currentMember?.lastReadedMessageId ?? 0,
            },

            // don't count your own messages
            senderId: {
              not: userId,
            },
          },
        });



        // private chat
        if (!conversation.isGroup) {

          const otherUser = conversation.members.find(
            member => member.userId !== userId
          );


          return {
            id: conversation.id,

            name:
              otherUser?.user.username ??
              conversation.name,

            imageUrl:
              otherUser?.user.pictureUrl ??
              conversation.imageUrl,


            lastMessageContent:
              conversation.lastMessage?.content ?? '',


            lastMessageTime:
              conversation.lastMessageTime,


            unreadedMessagesCount:
              unreadCount,
          };
        }



        // group chat
        return {
          id: conversation.id,

          name:
            conversation.name ??
            'Group',

          imageUrl:
            conversation.imageUrl,


          lastMessageContent:
            conversation.lastMessage?.content ?? '',


          lastMessageTime:
            conversation.lastMessageTime,


          unreadedMessagesCount:
            unreadCount,
        };

      }),
    );


    return result;
    }

    async addUserToConversation(conversationId: number, userId: string) {

        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
            }
        })

        if( !conversation || conversation.isGroup === false)
            throw new BadRequestException('Conversation is not a group or does not exist');

        return this.prisma.$transaction(async (tx) => {
            await tx.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    membersCount: {
                        increment: 1,
                    },
                },
            });

            return this.prisma.conversationMember.create({
                data: {
                    conversationId: conversationId,
                    userId: userId,
                },
            });
        })
    }
    
    async removeUserFromConversation(conversationId: number, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const conversation = await tx.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    membersCount: {
                        decrement: 1,
                    },
                },
            });

            if(conversation.membersCount < 1)
            return this.prisma.conversation.delete({where:{id:conversationId}});

            return this.prisma.conversationMember.deleteMany({
                where: {
                    conversationId: conversationId,
                    userId: userId,
                },
            });
        })
    }

    async getConversationMessages(
      userId: string,
      conversationId: number,
      limit = 30,
      cursor?: number,
    ) {
      const conversationMemberStatus = await this.prisma.conversationMember.findUnique({
        where: {
          userId_conversationId: {
            userId,
            conversationId,
          },
        },
      });
      
      if (!conversationMemberStatus) {
        throw new BadRequestException('Conversation member does not exist');
      }

      const messages = await this.prisma.message.findMany({
        where: {
          conversationId,
        },
      
        take: limit,
      
        ...(cursor && {
          skip: 1,
          cursor: {
            id: cursor,
          },
        }),
      
        orderBy: {
          id: 'desc',
        },
      
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              pictureUrl: true,
            },
          },
          messageStatus: true,
        },
      });

      return messages.map(message => ({

        ...message,


        deliveredCount:
          message.messageStatus.filter(
            s =>
              s.status === 'delivered' ||
              s.status === 'Seen'
          ).length,
        
        
        readCount:
          message.messageStatus.filter(
            s =>
              s.status === 'Seen'
          ).length,
        
        
     
        messageStatus: undefined,
        
      }));
    }
}
