import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-workspace-state-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-state-toggle-button.component.html',
  styleUrl: './workspace-state-toggle-button.component.scss'
})
export class WorkspaceStateToggleButtonComponent {
  @Output() menu: EventEmitter<void> = new EventEmitter();
  imagePath: string = `hide_nav`;
  displayOpenMessage: boolean = false;
  displayCloseMessage: boolean = true;


  /**
   * Toggles the workspace menu via button click
   */
  toggleWorkspaceMenu() {
    this.menu.emit();
    this.switchMessage();
    this.switchImagePath();
  }


  /**
  * Switches classes around to show the open/close text on the Button
  */
  switchMessage() {
    if (!this.displayOpenMessage) {
      this.displayOpenMessage = true;
      this.displayCloseMessage = false;
    } else {
      this.displayOpenMessage = false;
      this.displayCloseMessage = true;
    }
  }


  /**
   * Switches the image path to show the correct image on the close button
   */
  switchImagePath() {
    if (this.imagePath == `show_nav`) {
      this.imagePath = `hide_nav`;
    } else {
      this.imagePath = `show_nav`;
    }
  }
}
