import { Injectable, signal } from "@angular/core";
import SearchUsersData from "../../main/DTOS/search-users-data";




@Injectable({
    providedIn: 'root'
})
export default class UsersStore{
    
    Users = signal<SearchUsersData[]>([])


}