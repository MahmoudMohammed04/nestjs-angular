import { computed, Injectable, signal } from '@angular/core';

import { ConversationDTO } from '../main/DTOS/conversation.dto';
import { messageDTO, MessageStatus } from '../main/DTOS/message.dto';
import { ConversationApiService } from '../Providers/APIProvider/conversationApiService.service';
import { ApiService } from '../Providers/APIProvider/apiService.service';
import { FirebaseService } from '../Providers/FireBaseProvider/Firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly conversationApi: ConversationApiService,
    private readonly api: ApiService,
    private readonly firebaseService: FirebaseService
  ) {}

  conversations = signal<ConversationDTO[]>([]);

  currentConversationId = signal<number | null>(null);

  conversationMessagesMap = signal<Map<number, messageDTO[]>>(new Map());

  currentChatMessages = computed(() => {
    const id = this.currentConversationId();

    return id === null
      ? []
      : this.conversationMessagesMap().get(id) ?? [];
  });

  // Inside ChatService
async connect() {
  

  await this.api.connect();
  console.log('connected');

 
  this.api.on<messageDTO>('messageReceived', (message) => {
  
    this.receiveMessage(message);
  });

  this.api.on<messageDTO>('messageDelivered', (message) => {
    this.updateMessageStatus(message.messageId, MessageStatus.delivered);
  });

  this.api.on<messageDTO>('messageSeen', (message) => {
    this.updateMessageStatus(message.messageId, MessageStatus.seen);
  });
}


  async disconnect() {
    this.api.off('messageReceived');
    this.api.off('messageDelivered');
    this.api.off('messageSeen');
    await this.api.disconnect();
  }

  loadConversations() {
  this.conversationApi.getConversations().subscribe((conversations:any) => {
    const conversationsDto: ConversationDTO[] = conversations.map((c:any) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl,

      lastMessageContent: c.lastMessage?.content ?? '',
      lastMessageTime:  new Date(c.lastMessageTime) ?? undefined,

      userOnline: false,
      unreadMessageCount: c.unreadedMessagesCount ?? 0,

      selected: false,
    }));

    this.conversations.set(conversationsDto);
  });
}


  loadMessages(conversationId: number) {

    function convertState(message:any) {

        if(message.deliveredCount === message.conversationMembersCount) return MessageStatus.delivered;
        else if(message.seenCount === message.conversationMembersCount) return MessageStatus.seen;
        else return MessageStatus.sent
    }

    this.conversationApi.getMessages(conversationId).subscribe((messages: any[]) => {

    const mappedMessages: messageDTO[] = messages.map((m:any) => ({
      messageId: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,

      sentAt: new Date(m.sentAt ?? m.time),

      status: convertState(m),

      isSent: m.senderId === this.firebaseService.getUserId(),
      showAvatar: false,
      senderName: m.sender?.username ?? '',
      avatarUrl: m.sender?.pictureUrl ?? '',

      attachments: [],
    }));

    this.conversationMessagesMap.update((map) => {
      const newMap = new Map(map);
      newMap.set(conversationId, mappedMessages);
      return newMap;
    });
  });
} 

  async sendMessage(content: string) {

   

    const conversationId = this.currentConversationId();

    if (!conversationId) {
      return;
    }

    console.log(conversationId + ' ' + content);
    const message = await this.api.emitWithAck<messageDTO>(
      'sendMessage',
      {
        conversationId,
        content,
      },
    );
   

    message.isSent = true;
    message.attachments = [];
    message.status = MessageStatus.sent;

    console.log(message);
    message.sentAt = new Date();
    this.addMessage(message);
  }

  selectConversation(id: number) {
    this.currentConversationId.set(id);

    if (!this.conversationMessagesMap().has(id)) {
      this.loadMessages(id);
    }

    this.conversations.update((conversations) =>
      conversations.map((conversation) => ({
        ...conversation,
        selected: conversation.id === id,
        unreadMessageCount:
          conversation.id === id
            ? 0
            : conversation.unreadMessageCount,
      })),
    );
  }

  private receiveMessage(message: messageDTO) {
    message.attachments = [];
    message.sentAt = new Date();
    this.conversationMessagesMap.update((map) => {
      const newMap = new Map(map);
      
      message.conversationId = this.currentConversationId() ?? 0;

      const messages =
        newMap.get(message.conversationId) ?? [];

      newMap.set(message.conversationId, [
        ...messages,
        message,
      ]);

      return newMap;
    });

    this.conversations.update((conversations) =>
      conversations.map((conversation) => {
        if (conversation.id !== message.conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          lastMessageContent: message.content,
          lastMessageTime: message.sentAt,
          unreadMessageCount:
            conversation.selected
              ? 0
              : (conversation.unreadMessageCount ?? 0) + 1,
        };
      }).sort((a, b) => b.lastMessageTime!.getTime() - a.lastMessageTime!.getTime()),
    );
  }

  addMessage(message: messageDTO) {
    this.receiveMessage(message);
  }

  private updateMessageStatus(
    messageId: number,
    status: messageDTO['status'],
  ) {
    this.conversationMessagesMap.update((map) => {
      const newMap = new Map(map);

      newMap.forEach((messages, key) => {
        newMap.set(
          key,
          messages.map((m) =>
            m.messageId === messageId
              ? { ...m, status }
              : m,
          ),
        );
      });

      return newMap;
    });
  }
}