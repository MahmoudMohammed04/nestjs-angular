import { Component, EventEmitter, inject, Output } from '@angular/core';
import { messageDTO,MessageStatus } from '../../../DTOS/message.dto';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../Services/chat.service';

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  
  chatService: ChatService = inject(ChatService)
  content = '';

  async send()
  {
    

    if(this.content.length === 0) return;
    const message: messageDTO = {
      messageId: -1,
      conversationId: -1,
      isSent: true,
      senderId: 'unkown',
      content: this.content,
      showAvatar: false,
      senderName: 'unkown',
      sentAt: new Date(),
      status: MessageStatus.pending,
      attachments: []
    }

    this.content = '';
    await this.chatService.sendMessage(message.content);

     

  }
}
