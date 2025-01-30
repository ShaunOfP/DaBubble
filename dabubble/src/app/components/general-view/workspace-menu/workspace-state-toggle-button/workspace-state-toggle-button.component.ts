import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-workspace-state-toggle-button',
  standalone: true,
  imports: [],
  templateUrl: './workspace-state-toggle-button.component.html',
  styleUrl: './workspace-state-toggle-button.component.scss'
})
export class WorkspaceStateToggleButtonComponent {
  @Output() menu: EventEmitter<void> = new EventEmitter();
  imagePath: string = `hide_nav`;
  imagePath1: boolean = true;

  toggleWorkspaceMenu(){
    this.menu.emit();
  }


  /**
  * Switches classes around to show the open/close text on the Button
  */
  switchMessage() {
    let closeMessage = document.getElementById('close-message');
    let openMessage = document.getElementById('open-message');

    if (openMessage?.classList.contains('d-none')) {
      openMessage?.classList.remove('d-none');
      closeMessage?.classList.add('d-none');
    } else {
      closeMessage?.classList.remove('d-none');
      openMessage?.classList.add('d-none');
    }
  }


  /**
   * Switches the image path to show the correct image on the close button
   */
  switchImagePath() {
    if (this.imagePath1) {
      this.imagePath = `hide_nav`;
    } else {
      this.imagePath = `show_nav`;
    }
  }
}
