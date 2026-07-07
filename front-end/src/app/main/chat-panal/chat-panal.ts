import { Component, inject, Inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MessageComponent } from './components/message-component/message-component';
import { ChatHeader } from './components/chat-header/chat-header';
import { ChatInput } from './components/chat-input/chat-input';
import { MessagesArea } from './components/messages-area/messages-area';
import { messageDTO } from '../DTOS/message.dto';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-chat-panal',
  imports: [MessagesArea,ChatHeader,ChatInput],
  templateUrl: './chat-panal.html',
  styleUrl: './chat-panal.css',
})
export class ChatPanal {
  
 
  chatService = inject(ChatService);


}
