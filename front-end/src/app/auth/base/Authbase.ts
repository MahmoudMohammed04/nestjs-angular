import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [RouterOutlet,RouterModule,RouterLink],
  templateUrl: './Authbase.html',
  styleUrl: './Authbase.css',
  standalone: true
})
export class AuthBase {}
