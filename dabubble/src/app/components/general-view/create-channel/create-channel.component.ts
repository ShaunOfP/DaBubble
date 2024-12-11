import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  @Output() callParentToClose: EventEmitter<void> = new EventEmitter();
  
  closeCreateChannel(){
    this.callParentToClose.emit();
  }

  formSubmit(){

  }
}