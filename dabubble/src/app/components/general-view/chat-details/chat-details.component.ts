import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();

  closeChatDetails() {
    this.callParent.emit();
  }
}
