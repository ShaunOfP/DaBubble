import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { WorkspaceMenuCloseButtonComponent } from './workspace-menu-close-button/workspace-menu-close-button.component';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-view',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    WorkspaceMenuComponent,
    WorkspaceMenuCloseButtonComponent,
    HeaderComponent,
    ThreadComponent,
    ChatComponent,
  ],
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.scss',
})
export class GeneralViewComponent {
  workspaceMenuIsVisible: boolean = true;
  threadIsVisible: boolean = true;
  toggleNumber: number = 0;


  /**
   * Hides/Closes the Thread-Component
   */
  closeThread() {
    this.threadIsVisible = false;
  }


  toggle(){
    if (this.toggleNumber == 0){
      this.closeWorkspaceMenu();
      this.toggleNumberIncrease();
    } else {
      this.openWorkspaceMenu();
      this.toggleNumberDecrease();
    }
  }


  /**
   * 
   */
  openWorkspaceMenu(){
    this.workspaceMenuIsVisible = true;
  }


  /**
   *
   */
  closeWorkspaceMenu() {
    this.workspaceMenuIsVisible = false;
  }


  toggleNumberIncrease() {
    this.toggleNumber++;
  }


  toggleNumberDecrease() {
    this.toggleNumber--;
  }
}
