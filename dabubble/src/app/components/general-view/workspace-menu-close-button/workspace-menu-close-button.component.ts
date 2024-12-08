import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-workspace-menu-close-button',
  standalone: true,
  imports: [],
  templateUrl: './workspace-menu-close-button.component.html',
  styleUrl: './workspace-menu-close-button.component.scss'
})
export class WorkspaceMenuCloseButtonComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();

  toggleNumber: number = 0;
  imagePath: string = `hide_nav`;


  /**
   * Calls different functions to enable the toggling of the workspace close button
   */
  toggle() {
    if (this.toggleNumber == 0) {
      this.closeWorkspaceMenu();
      this.switchMessage();
      this.switchImagePath();
      this.increase();
    } else {
      this.openWorkspaceMenu();
      this.switchMessage();
      this.switchImagePath();
      this.decrease();
    }
  }


  /**
   * Calls the parent to close the workspace menu
   */
  closeWorkspaceMenu() {
    this.callParent.emit();
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
    if (this.toggleNumber == 1) {
      this.imagePath = `hide_nav`;
    } else {
      this.imagePath = `show_nav`;
    }
  }


  /**
   * Calls the parent to open the Workspace Menu
   */
  openWorkspaceMenu() {
    this.callParent.emit();
  }


  /**
   * Increases the Variable toggleNumber
   */
  increase() {
    this.toggleNumber++;
  }


  /**
   * Decreases the Variable toggleNumber
   */
  decrease() {
    this.toggleNumber--;
  }
}