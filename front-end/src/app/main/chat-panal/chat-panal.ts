import { Component } from '@angular/core';
import { MessageItem } from '../components/message-item/message-item';
import { MessageComponent } from '../components/message-component/message-component';

@Component({
  selector: 'app-chat-panal',
  imports: [MessageItem,MessageComponent],
  templateUrl: './chat-panal.html',
  styleUrl: './chat-panal.css',
})
export class ChatPanal {}
