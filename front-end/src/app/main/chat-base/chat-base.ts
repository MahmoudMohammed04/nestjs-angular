import { Component, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { ConversationsPanal } from '../conversations-panal/conversations-panal';
import { ChatPanal } from '../chat-panal/chat-panal';
import { RouterOutlet } from '@angular/router';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-chat-base',
  imports: [ConversationsPanal,ChatPanal],
  templateUrl: './chat-base.html',
  styleUrl: './chat-base.css',
})
export class ChatBase implements OnInit , OnDestroy {

    chatService: ChatService = inject(ChatService);

    async ngOnInit() {
        await this.chatService.connect();
    }

    async ngOnDestroy() {
        await this.chatService.disconnect();
    }
}
