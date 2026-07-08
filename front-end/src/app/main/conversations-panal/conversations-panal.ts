import { Component, EventEmitter, inject, Inject, OnInit, Output, signal } from '@angular/core';
import { CoversationItem } from './components/coversation-item/coversation-item';
import { ConversationDTO } from '../DTOS/conversation.dto';
import { ChatService } from '../../Services/chat.service';
import { ConversationApiService } from '../../Providers/APIProvider/conversationApiService.service';
import { SearchUserWindow } from './components/search-user-window/search-user-window';

@Component({
  selector: 'app-conversations-panal',
  imports: [CoversationItem,SearchUserWindow],
  templateUrl: './conversations-panal.html',
  styleUrl: './conversations-panal.css',
})
export class ConversationsPanal implements OnInit {


  chatService:ChatService = inject(ChatService);
  private conversationService:ConversationApiService = inject(ConversationApiService);


  onClickOpenSearchWindow()
  {
    this.chatService.openSearchWindow.set(true);
  }

  ngOnInit(): void {
    //call api here

  //   const conversations =  [
  //     {
  //       id: 1,
  //       name: 'Julian Pearce',
  //       lastMessageContent: 'Hello, how are you?',
  //       lastMessageTime: new Date(),
  //       imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //       userOnline: true,
  //       unreadMessageCount: 2,
  //       selected: false
  //     },
  //     {
  //       id: 2,
  //       name: 'Julian Pearce',
  //       lastMessageContent: 'Hello, how are you?',
  //       lastMessageTime: new Date(),
  //       imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //       userOnline: true,
  //       unreadMessageCount: 15,
  //       selected: false
  //     },
  // ]

   this.conversationService.getConversations().subscribe({
     next: (conversations : any) => {this.chatService.loadConversations(); console.log(conversations)},
     error: (error) => console.log(error)
   })

  // this.chatService.conversations.set(conversations);

  }

}
