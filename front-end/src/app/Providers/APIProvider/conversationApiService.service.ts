import { Injectable } from "@angular/core";
import { ApiService } from "./apiService.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ConversationApiService {
  constructor(private api: ApiService) {}

  getConversations() {
    return this.api.get('conversation');
  }

  getMessages(conversationId: number) : Observable<any[]> {
    return this.api.get(`conversation/${conversationId}/messages`);
  }

  createOneToOne(receiverId: string) {
    return this.api.post('conversation/one-to-one', {
      receiverId,
    });
  }

  createGroup(dto: {
    name: string;
    receiversId: string[];
  }) {
    return this.api.post('conversation/group', dto);
  }

  addUser(conversationId: number, userId: string) {
    return this.api.post(
      `conversation/${conversationId}/add-user`,
      { userId },
    );
  }

  removeUser(conversationId: number, userId: string) {
    return this.api.delete(
      `conversation/${conversationId}/remove-user/${userId}`,
    );
  }
}