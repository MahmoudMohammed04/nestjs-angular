

export type AttachmentType = 'image' | 'file';

export interface ChatAttachment {
  type: AttachmentType;
  url?: string;
  name?: string;
  size?: string;
  fileType?: string;
}

export class messageDTO {
    messageId: number = 0;
    conversationId: number = 0;
    isSent: boolean =  false;
    senderId: string = '';
    content: string = '';
    showAvatar: boolean = false;
    avatarUrl?: string = '';
    senderName: string = '';
    sentAt: Date = new Date();
    status: MessageStatus = MessageStatus.pending;
    attachments: ChatAttachment[] = [];
}

export enum MessageStatus {
    pending = 'pending',
    sent = 'sent',
    delivered = 'delivered',
    seen = 'seen',
}