import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss'
})
export class AddMembersComponent {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  currentChannelName: string = 'Entwicklerchannel'; //change

  /**
   * Emits a signal to the parent component to close the Add Members Menu
   */
  closeAddMembersMenu() {
    this.closeMe.emit();
  }

  //button click zum hinzufügen

  //eventlistener für onchange input um kontakte zu durchsuchen
}
