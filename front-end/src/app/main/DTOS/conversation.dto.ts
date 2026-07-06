export class ConversationDTO{
    id: number = 0;
    name: string = '';
    imageUrl: string = '';
    lastMessageContent?: string;
    lastMessageTime?: Date;
    userOnline: boolean = false;
    unreadMessageCount?: number = 0;
    selected: boolean = false
}