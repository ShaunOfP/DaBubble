import { Component, ElementRef, ViewChild } from '@angular/core';
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

  /**
   * Hides/Closes the Thread-Component
   */
  closeThread() {
    this.threadIsVisible = false;
  }

  /**
   *
   */
  closeWorkspaceMenu() {
    this.workspaceMenuIsVisible = false;
  }
}
