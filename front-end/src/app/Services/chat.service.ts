import { Injectable } from "@angular/core";
import { ConversationService } from "./conversations/conversation.service";
import { MessageService } from "./messages/message.service";
import { ChatSocketService } from "./socket/chat-socket.service";
import { ConversationStore } from "./conversations/conversation.store";



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversations: typeof this.conversationStore.conversations;
  currentMessages: typeof this.messageService.currentMessages;
  currentConversationId: typeof this.conversationService.currentConversationId;

  constructor(
    private conversationStore: ConversationStore,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private socketService: ChatSocketService,
  ) {

     this.conversations = this.conversationStore.conversations;
     this.currentMessages = this.messageService.currentMessages;
     this.currentConversationId = this.conversationService.currentConversationId;
  }


 


  async connect() {
    await this.socketService.connect();
  }


  async disconnect() { 
    await this.socketService.disconnect();
  }



  selectConversation(id:number) {
     this.conversationService.selectConversation(id);
     this.messageService.loadMessages(id);
  }

  loadConversations() {
    return this.conversationService.loadConversations();
  }

  sendMessage(content:string) {
    return this.messageService.sendMessage(content);
  }

}