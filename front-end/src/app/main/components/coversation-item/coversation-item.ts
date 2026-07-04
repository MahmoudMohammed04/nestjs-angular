import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';


@Component({
  selector: 'app-coversation-item',
  imports: [NgClass],
  templateUrl: './coversation-item.html',
  styleUrl: './coversation-item.css',
})
export class CoversationItem {
  @Input() selected = false;
}
