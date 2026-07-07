import { Injectable, signal } from "@angular/core";
import { ConversationApiService } from "../../Providers/APIProvider/conversationApiService.service";
import { messageDTO, MessageStatus } from "../../main/DTOS/message.dto";
import { MessageStore } from "./message.store";
import { FirebaseService } from "../../Providers/FireBaseProvider/Firebase.service";
import { ChatSocketService } from "../socket/chat-socket.service";
import { firstValueFrom } from "rxjs";
import { ConversationStore } from "../conversations/conversation.store";


@Injectable({
providedIn:'root'
})
export class MessageService{

    currentMessages!: typeof this.store.currentMessages;
    currentConversationId!: typeof this.store.currentConversation;
    constructor(
    private api:ConversationApiService,
    private socket:ChatSocketService,
    private store:MessageStore,
    private firebase:FirebaseService,
    private conversationStore:ConversationStore
    ){

        this.currentMessages = this.store.currentMessages;
        this.currentConversationId = this.store.currentConversation;
    }




    private convertState(message:any){

    if(message.readCount === message.conversationMembersCount) return MessageStatus.seen;
    else if(message.deliveredCount === message.conversationMembersCount) return MessageStatus.delivered;
    else return MessageStatus.sent
    }


    async loadMessages(conversationId:number){

    this.store.currentConversation.set(conversationId);
    const messages = await firstValueFrom(this.api.getMessages(conversationId));

    console.log(messages);

    const mapped : messageDTO[] = messages.map((m:any)=>({

     messageId:m.id,
     conversationId:m.conversationId,

     senderId:m.senderId,

     content:m.content,

     sentAt:new Date(m.sentAt),


     isSent: m.senderId===this.firebase.getUserId(),

     status:this.convertState(m),


     senderName:m.sender.username,


     avatarUrl:m.sender.pictureUrl,


     attachments:[]

    })).sort((a:any,b:any)=>(a.sentAt.getTime() - b.sentAt.getTime()));


    this.store.setMessages(conversationId,mapped);

    }



    async sendMessage(content:string){


    const id = this.store.currentConversation();

    if(!id)
     return;



    const message:any = await this.socket.sendMessage({
      conversationId:id,
      content
     });

     console.log(message);
     message.sentAt = new Date(message.sentAt);
     message.attachments = [];
     message.isSent = true;
     message.status = MessageStatus.sent;
     message.messageId = message.id;

    this.store.addMessage(message);
    this.conversationStore.update(id,{lastMessageTime:message.sentAt,lastMessageContent:message.content},true);

    }



    markLastMessageSeen(){

    
    const messages = this.store.currentMessages();

    if(messages.length===0)
     return;

    const last = messages[messages.length-1];


    if(last && !last.isSent){

     this.socket.seenMessage(
       last.messageId
     );

    }

    }


}