import { computed, effect, Injectable, signal } from "@angular/core";
import { ConversationApiService } from "../../Providers/APIProvider/conversationApiService.service";
import { messageDTO, MessageStatus } from "../../main/DTOS/message.dto";


@Injectable({
providedIn:'root'
})
export class MessageStore {

    constructor() {
      effect(() => {
        console.log(
          this.currentMessages().map(m => ({
            id: m.messageId,
            status: m.status,
          }))
        );
      });
    }

    messages = signal<Map<number,messageDTO[]>>(new Map());
    currentConversation = signal<number|null>(null);

    currentMessages = computed(()=>{

    const id =this.currentConversation();

     if(!id)
       return [];

     return this.messages().get(id) ?? [];

    });

    

    setMessages( conversationId:number, messages:messageDTO[]){

        this.messages.update(map=>{

         const newMap=new Map(map);

         newMap.set(conversationId,messages);

         return newMap;

        });

    }



    addMessage(message:messageDTO){


        this.messages.update(map=>{

        const newMap=new Map(map);

        const list = newMap.get(message.conversationId) ?? [];


        newMap.set(message.conversationId,[...list,message]);


        return newMap;

        });

    }



    updateStatus(id:number,conversationId:number,status:MessageStatus){

        this.messages.update(map=>{

        const newMap=new Map(map);

        const messages = newMap.get(conversationId) ?? [];

        console.log("Current:", this.currentConversation());
        console.log("Updating:", conversationId);
        console.log("messageid", id);
        console.log(status);

        if(!messages) return newMap;

        newMap.set(conversationId,messages.map(m=>m.messageId <= id?{...m,status}:m));
        
        console.log(
  "theMap",
  newMap.get(conversationId)?.map(m => ({
    id: m.messageId,
    status: m.status,
  }))
);
        return newMap;

        });

    }

}