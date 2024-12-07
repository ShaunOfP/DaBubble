import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  

  /**
   * Emit a signal to the parent element to hide/close the Thread Menu
   */
  closeThread(){
    this.callParent.emit();
  }
}
