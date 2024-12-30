import { Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { WorkspaceMenuCloseButtonComponent } from './workspace-menu-close-button/workspace-menu-close-button.component';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  animations: [
    trigger('slideLeftAnimation', [
      state('opened', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-120%)' })),
      transition('opened <=> closed', [animate('0.125s ease-in')])
    ]),
    trigger('slideRightAnimation', [
      state('opened', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(120%)' })),
      transition('opened <=> closed', [animate('0.125s ease-in')])
    ])
  ]
})
export class GeneralViewComponent {
  workspaceMenuIsVisible: boolean = true;
  threadIsVisible: boolean = true;
  toggleNumber: number = 0;
  showCreateChannelOverlay: boolean = false;
  @ViewChild(ChatComponent) chatComponent!: ChatComponent;
  workspaceMenuState: 'opened' | 'closed' = 'opened';
  threadMenuState: 'opened' | 'closed' = 'opened';

  /**
   * Hides/Closes the Thread-Component
   */
  closeThread() {
    this.threadMenuState = 'closed';
    setTimeout(() => {
      this.threadIsVisible = false;
    }, 125);
  }


  /**
   * Calls different functions to allow the toggling of the Workspace menu
   */
  toggleWorkspaceMenu() {
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
    this.workspaceMenuState = 'opened';
    // setTimeout(() => {
    //   this.workspaceMenuIsVisible = true;
    // }, 125);
  }


  /**
   *Closes the Workspace menu
   */
  closeWorkspaceMenu() {
    this.workspaceMenuState = 'closed';
    setTimeout(() => {
      this.workspaceMenuIsVisible = false;
    }, 125);
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


  /**
   * Toggles visibility for the Create Channel Component
   */
  toggleCreateChannelOverlay() {
    this.showCreateChannelOverlay = !this.showCreateChannelOverlay;
  }


  openNewMessage() {
    this.chatComponent.openNewMessageWindow();
  }
}
