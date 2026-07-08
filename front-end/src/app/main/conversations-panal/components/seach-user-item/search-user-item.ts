import { Component, inject, Input } from '@angular/core';
import { ConversationService } from '../../../../Services/conversations/conversation.service';

@Component({
  selector: 'app-search-user-item',
  imports: [],
  templateUrl: './search-user-item.html',
  styleUrl: './search-user-item.css',
})
export class SearchUserItem {

  @Input() Username = ''
  @Input() Email = ''
  @Input() userImage = ''
  @Input() userId = ''

  private readonly conversationService: ConversationService = inject(ConversationService);

  onSelect()
  {
    this.conversationService.createConversationOneToOne(this.userId);
  }
}
