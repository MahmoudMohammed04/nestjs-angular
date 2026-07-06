import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { messageDTO,MessageStatus,ChatAttachment } from '../../../DTOS/message.dto';




@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-component.html',
  styleUrls: ['./message-component.scss']
})
export class MessageComponent {
  @Input() messageId = 0;
  @Input() conversationId = 0;
  @Input() isSent = false;
  @Input() content = '';
  @Input() time? = '';
  @Input() status: MessageStatus = MessageStatus.pending;
  @Input() showAvatar = false;
  @Input() avatarUrl?: string;
  @Input() senderName = 'User';
  @Input() attachments: ChatAttachment[] = [];

 

  get hasAttachments(): boolean {
    return this.attachments.length > 0;
  }
}