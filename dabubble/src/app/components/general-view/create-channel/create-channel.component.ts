import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AddMembersToNewChannelComponent } from "../add-members-to-new-channel/add-members-to-new-channel.component";

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddMembersToNewChannelComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  @Output() callParentToClose: EventEmitter<void> = new EventEmitter();
  newChannelName: string = '';
  newChannelDescription: string | null = '';


  /**
   * Sends a call to the parent component to close the Component
   */
  closeCreateChannel() {
    this.callParentToClose.emit();
  }


  /**
   * Calls functions to ensure the right classes on the HTMLElements when the Component was closed
   */
  closeCreateChannelAndChangeClasses() {
    this.closeCreateChannel();
    this.closeAddMembersToNewChannelMenu();
    this.openCreateChannelContainer();
  }


  /**
   * Removes a class to make the AddMembersToNewChannel Component visible
   */
  openAddMembersToNewChannelMenu() {
    document.getElementById('addMembersToNewChannel')?.classList.remove('d-none');
  }


  /**
   * Adds a class to hide the Create-Channel-Container
   */
  closeCreateChannelContainer() {
    document.getElementById('create-channel-container')?.classList.add('d-none');
  }


  /**
   * Adds a class to hide the AddMembersToNewChannel Component
   */
  closeAddMembersToNewChannelMenu() {
    document.getElementById('addMembersToNewChannel')?.classList.add('d-none');
  }


  /**
   * Removes a class to make the Create-Channel-Container visible
   */
  openCreateChannelContainer() {
    document.getElementById('create-channel-container')?.classList.remove('d-none');
  }


  /**
   * Changes the active class on the submit button to enable it
   */
  enableSubmitButton() {
    document.getElementById('submit-btn')?.classList.remove('btn-primary--disable');
    document.getElementById('submit-btn')?.classList.add('btn-primary--default');
  }


  /**
   * Changes the active class on the submit button to disable it
   */
  disableSubmitButton() {
    document.getElementById('submit-btn')?.classList.add('btn-primary--disable');
    document.getElementById('submit-btn')?.classList.remove('btn-primary--default');
  }


  /**
   * Checks, if there is any input in the newChannelName Input Element
   */
  checkInput() {
    if (this.newChannelName.length > 0) {
      this.enableSubmitButton();
    } else {
      this.disableSubmitButton();
    }
  }


  /**
   * 
   * @param ngForm 
   */
  formSubmit(ngForm: NgForm) {
    this.openAddMembersToNewChannelMenu();
    this.closeCreateChannelContainer();

    if (ngForm.submitted && ngForm.form.valid) {
      // pass variables/upload
    }
  }
}