import { Injectable, signal } from "@angular/core";
import { ConversationApiService } from "../../Providers/APIProvider/conversationApiService.service";
import { ConversationStore } from "./conversation.store";
import { MessageService } from "../messages/message.service";
import { ConversationDTO } from "../../main/DTOS/conversation.dto";




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
openSearchWindow = signal(false);



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

async createConversationOneToOne(senderId: string)
{

  this.api.createOneToOne(senderId).subscribe((data:any)=>{
    console.log(data);
    const isExist = this.store.conversations().find(c=>c.id===data.id);

    if(!isExist){
      const con:ConversationDTO = {
        id:data.id,
        name:data.name,
        imageUrl:data.imageUrl,
        lastMessageContent:"",
        lastMessageTime:undefined,
        unreadMessageCount:0,
        userOnline:false,
        selected:false
      }

      this.store.set([...this.store.conversations(),con]);
    }
   
    this.openSearchWindow.set(false);
    this.selectConversation(data.id);
  })
}

async selectConversation(id:number){

    if(id === this.currentConversationId()) return;

    this.currentConversationId.set(id);

    this.store.conversations().forEach(c=>{
      if(c.id===id)
      c.selected = true;
      else
      c.selected = false;
    })
    await this.messageService.loadMessages(id);


    this.store.update(id,{
      selected:true,
      unreadMessageCount:0
    },true);


    this.messageService.markLastMessageSeen();

}

}