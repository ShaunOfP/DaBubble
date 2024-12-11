import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { WorkspaceMenuCloseButtonComponent } from './workspace-menu-close-button/workspace-menu-close-button.component';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { CreateChannelComponent } from "./create-channel/create-channel.component";

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
    CreateChannelComponent
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


  /**
   * Calls different functions to allow the toggling of the Workspace menu
   */
  toggle() {
    if (this.toggleNumber == 0) {
      this.closeWorkspaceMenu();
      this.toggleNumberIncrease();
    } else {
      this.openWorkspaceMenu();
      this.toggleNumberDecrease();
    }
  }


  /**
   * Opens the Workspace menu
   */
  openWorkspaceMenu() {
    this.workspaceMenuIsVisible = true;
  }


  /**
   *Closes the Workspace menu
   */
  closeWorkspaceMenu() {
    this.workspaceMenuIsVisible = false;
  }


  /**
   * Increases the toggleNumber
   */
  toggleNumberIncrease() {
    this.toggleNumber++;
  }


  /**
   * Decreses the toggleNumber
   */
  toggleNumberDecrease() {
    this.toggleNumber--;
  }

  toggleClassForCreateChannelOverlay() {
    document.getElementById('create-channel-overlay')?.classList.toggle('d-none');
  }
}
