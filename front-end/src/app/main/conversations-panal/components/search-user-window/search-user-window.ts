import { Component, inject, Inject, signal } from '@angular/core';
import UsersService from '../../../../Services/search-users/users.service';
import { SearchUserItem } from '../seach-user-item/search-user-item';
import { ChatService } from '../../../../Services/chat.service';

@Component({
  selector: 'app-sreach-user-window',
  imports: [SearchUserItem],
  templateUrl: './search-user-window.html',
  styleUrl: './search-user-window.css',
})
export class SearchUserWindow {

  private searchTimeout?: ReturnType<typeof setTimeout>;

  userService: UsersService = inject(UsersService);
  chatService: ChatService = inject(ChatService)

  async onTyping(event: Event)
  {
    const value = (event.target as HTMLInputElement).value;


    this.searchTimeout = setTimeout(() => {
    this.userService.SearchUsers(value);
    }, 300);
  }

  onClickOpenSearchWindow(event: Event)
  {
    console.log(event);
    if(event.target === event.currentTarget) 
    this.chatService.openSearchWindow.set(false);
  }
}
