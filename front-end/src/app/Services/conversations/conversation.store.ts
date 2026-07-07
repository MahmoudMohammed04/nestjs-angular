import { Injectable, signal } from "@angular/core";
import { ConversationDTO } from "../../main/DTOS/conversation.dto";



@Injectable({
 providedIn:'root'
})
export class ConversationStore {


 conversations = signal<ConversationDTO[]>([]);


 set(conversations:ConversationDTO[]){
   this.conversations.set(conversations);
 }


 update(id: number, data: Partial<ConversationDTO>, isSelected?: boolean) {
  this.conversations.update(list =>
    list
      .map(c =>
        c.id === id
          ? {
              ...c,
              ...data,
              unreadMessageCount: isSelected
                ? 0
                : (c.unreadMessageCount ?? 0 )+1,
            }
          : c
      )
      .sort((a, b) => (b.lastMessageTime?.getTime() ?? 0) - (a.lastMessageTime?.getTime() ?? 0))
  );
}

}