import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  formSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid){
      // pass variables/upload
    }
  }
}