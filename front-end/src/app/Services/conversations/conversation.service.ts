import { Injectable, signal } from "@angular/core";
import { ConversationApiService } from "../../Providers/APIProvider/conversationApiService.service";
import { ConversationStore } from "./conversation.store";
import { MessageService } from "../messages/message.service";




@Injectable({
providedIn:'root'
})
export class ConversationService {


constructor(
 private api:ConversationApiService,
 private store:ConversationStore,
 private messageService:MessageService
){}


currentConversationId = signal<number|null>(null);



loadConversations(){

 this.api.getConversations().subscribe((data:any) =>{

 const conversations = data.map((c:any)=>({

   id:c.id,
   name:c.name,
   imageUrl:c.imageUrl,

   lastMessageContent:
     c.lastMessageContent ?? '',


   lastMessageTime:
     c.lastMessageTime
     ? new Date(c.lastMessageTime)
     : undefined,


   unreadMessageCount:
     c.unreadedMessagesCount ?? 0,


   userOnline:false,
   selected:false,

 }));


 this.store.set(conversations);

 });

}



async selectConversation(id:number){

    if(id === this.currentConversationId()) return;

    this.currentConversationId.set(id);


    await this.messageService.loadMessages(id);


    this.store.update(id,{
      selected:true,
      unreadMessageCount:0
    },true);


    this.messageService.markLastMessageSeen();

}

}