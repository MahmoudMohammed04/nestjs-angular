import { Component } from '@angular/core';
import { ConversationsPanal } from '../conversations-panal/conversations-panal';
import { ChatPanal } from '../chat-panal/chat-panal';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chat-base',
  imports: [ConversationsPanal,ChatPanal],
  templateUrl: './chat-base.html',
  styleUrl: './chat-base.css',
})
export class ChatBase {}
