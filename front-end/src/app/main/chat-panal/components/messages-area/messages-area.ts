import { Component, inject, Inject, Input } from '@angular/core';
import { MessageComponent } from '../message-component/message-component';
import { messageDTO,MessageStatus } from '../../../DTOS/message.dto';
import { ChatService } from '../../../../Services/chat.service';

@Component({
  selector: 'app-messages-area',
  imports: [MessageComponent],
  templateUrl: './messages-area.html',
  styleUrl: './messages-area.css',
})
export class MessagesArea {
  messageStatus = MessageStatus;
  
  chatService: ChatService = inject(ChatService); 
  
  
  
}
