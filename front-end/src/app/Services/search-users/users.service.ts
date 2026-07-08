import { Injectable } from "@angular/core";
import { defaultUrlMatcher } from "@angular/router";
import UsersStore from "./users.store";
import { ApiService } from "../../Providers/APIProvider/apiService.service";
import SearchUsersData from "../../main/DTOS/search-users-data";



@Injectable({
    providedIn: 'root'
})
export default class UsersService {

    usersData: typeof this.usersStore.Users
    constructor(private readonly usersStore: UsersStore,private readonly api:ApiService) {
        this.usersData = usersStore.Users
    }

      async SearchUsers(content: string) {

        if (!content?.trim())
        {
          this.usersStore.Users.set([]);
          return
        }

        const value = content.trim();

 
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        this.api.get<SearchUsersData[]>(
          isEmail
            ? `user/search-email?email=${encodeURIComponent(value)}`
            : `user/search-username?username=${encodeURIComponent(value)}`
        )
        .subscribe(result => {
          this.usersStore.Users.set(result);
        });
  }


}