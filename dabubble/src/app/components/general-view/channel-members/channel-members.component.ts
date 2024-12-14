import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  @Output() openAddMembers: EventEmitter<void> = new EventEmitter();


  /**
   * Emits a signal to the parent component to open the Add Members Menu
   */
  openAddMembersMenu() {
    this.openAddMembers.emit();
  }


  /**
   * 
   */
  openProfileInfo() {
    //Öffnen des Profilinfo Containers, wenn nicht die eigenen Member Card
  }


  /**
   * Emits a signal to the parent component to close the Channel Members Menu
   */
  closeChannelMembersMenu() {
    this.closeMe.emit();
  }
}
