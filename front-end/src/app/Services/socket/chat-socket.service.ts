import { Injectable, signal } from "@angular/core";
import { ConversationApiService } from "../../Providers/APIProvider/conversationApiService.service";
import { ApiService } from "../../Providers/APIProvider/apiService.service";
import { MessageStore } from "../messages/message.store";
import { MessageStatus } from "../../main/DTOS/message.dto";
import { ConversationStore } from "../conversations/conversation.store";



@Injectable({
providedIn:'root'
})
export class ChatSocketService{

    private readonly sendMessageSocket:string = "sendMessage";
    private readonly messageReceivedSocket:string = "messageReceived";
    private readonly reciveMessageDeliveredSocket:string = "messageDelivered";
    private readonly reciveMessageSeenSocket:string = "messageSeen";
    private readonly sendMessageSeenSocket:string = "seenMessage";
    private readonly sendMessageDeliveredSocket:string = "deliverMessage";

    constructor(
    private api:ApiService,
    private store:MessageStore,
    private coversationStore:ConversationStore
    ){}



    async connect(){

    await this.api.connect();

    this.api.on(this.messageReceivedSocket,(message:any)=>{
        message.sentAt = new Date(message.sentAt);
        message.attachments = [];
        this.store.addMessage(message);
        this.coversationStore.update(message.conversationId,{lastMessageTime:message.sentAt,lastMessageContent:message.content},message.conversationId===this.store.currentConversation());
        this.api.emit(this.sendMessageDeliveredSocket,{messageId:message.id});
    });


    this.api.on(this.reciveMessageDeliveredSocket,(message:any)=>{
        console.log("delevired");
        this.store.updateStatus(
         message.id,
         message.conversationId,
         MessageStatus.delivered
        );
    });


    this.api.on(this.reciveMessageSeenSocket,(message:any)=>{
        this.store.updateStatus(
         message.id,
         message.conversationId,
         MessageStatus.seen
        );
    });


    }



    sendMessage(data:any){
        return this.api.emitWithAck(this.sendMessageSocket,data);
    }

    deliverMessage(id:number){
        return this.api.emitWithAck(this.sendMessageDeliveredSocket,{messageId:id});
    }

    seenMessage(id:number){
        return this.api.emitWithAck(this.sendMessageSeenSocket,{messageId:id});
    }


    async disconnect(){

    this.api.off('messageReceived');
    this.api.off('messageDelivered');
    this.api.off('messageSeen');

    await this.api.disconnect();

    }

}