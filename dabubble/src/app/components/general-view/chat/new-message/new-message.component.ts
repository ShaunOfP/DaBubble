import { Component } from '@angular/core';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  
  
  //Called when search is finished
  changeHeaders(){
    document.getElementById('chat-container')?.classList.add('height-normal-header');
    document.getElementById('chat-container')?.classList.remove('height-new-message');
  }
}
