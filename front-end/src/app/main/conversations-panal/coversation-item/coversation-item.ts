import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Inject, input, Input, Output, signal } from '@angular/core';
import { ChatService } from '../../../Services/chat.service';


@Component({
  selector: 'app-coversation-item',
  imports: [NgClass],
  templateUrl: './coversation-item.html',
  styleUrl: './coversation-item.css',
})
export class CoversationItem {
  @Input() selected = false;

  @Input() conversationId = 0;
  @Input() conversationName = '';
  @Input() conversationImage = '';
  @Input() conversationLastMessage? = '';
  @Input() conversationLastMessageTime? = '';
  @Input() conversationUnreadMessages? = 0;
  @Input() conversationOnline = false

  chatService = inject(ChatService);

  onSelect() {
    this.selected = true
    this.conversationUnreadMessages = 0
    this.chatService.selectConversation(this.conversationId)
  }

}
