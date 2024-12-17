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

  closeCreateChannel() {
    this.callParentToClose.emit();
  }

  openAddMembersToNewChannelMenu(){
    document.getElementById('addMembersToNewChannel')?.classList.remove('d-none');
  }

  closeCreateChannelContainer(){
    document.getElementById('create-channel-container')?.classList.add('d-none');
  }

  formSubmit(ngForm: NgForm) {
    this.openAddMembersToNewChannelMenu();
    this.closeCreateChannelContainer();

    if (ngForm.submitted && ngForm.form.valid){
      // pass variables/upload
    }
  }
}