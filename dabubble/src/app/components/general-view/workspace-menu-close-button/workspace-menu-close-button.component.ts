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

  variable: number = 0;
  imagePath: string = `hide_nav`;


  toggle() {
    if (this.variable == 0) {
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


  closeWorkspaceMenu() {
    this.callParent.emit();
  }


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


  switchImagePath() {
    if (this.variable == 1) {
      this.imagePath = `hide_nav`;
    } else {
      this.imagePath = `show_nav`;
    }
  }


  openWorkspaceMenu() {
    this.callParent.emit();
  }


  increase() {
    this.variable++;
  }


  decrease() {
    this.variable--;
  }
}