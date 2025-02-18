import { Component, EventEmitter, Output } from '@angular/core';
import { PublicChatComponent } from '../public-chat.component';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss'
})
export class AddMembersComponent {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  currentChannelName: string = '';

  constructor(public publicChatComponent: PublicChatComponent){

  }

  /**
   * Emits a signal to the parent component to close the Add Members Menu
   */
  closeAddMembersMenu() {
    this.closeMe.emit();
  }

  //button click zum hinzufügen

  //eventlistener für onchange input um kontakte zu durchsuchen
}
