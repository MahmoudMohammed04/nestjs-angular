import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'seen';
export type AttachmentType = 'image' | 'file';

export interface ChatAttachment {
  type: AttachmentType;
  url?: string;
  name?: string;
  size?: string;
  fileType?: string;
}

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-component.html',
  styleUrls: ['./message-component.scss']
})
export class MessageComponent {
  @Input() isSent = false;
  @Input() content = '';
  @Input() time = '';
  @Input() status: MessageStatus = 'pending';
  @Input() showAvatar = true;
  @Input() avatarUrl?: string;
  @Input() senderName = 'User';
  @Input() attachments: ChatAttachment[] = [];

  get hasAttachments(): boolean {
    return this.attachments.length > 0;
  }
}