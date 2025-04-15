import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { ChatService } from '../../services/firebase-services/chat.service';
import { AuthService } from '../../services/firebase-services/auth.service';

@Component({
  selector: 'app-general-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ThreadComponent,
    ChatComponent,
    CreateChannelComponent,
    WorkspaceMenuComponent
  ],
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.scss'
})
export class GeneralViewComponent implements OnInit {
  threadIsVisible?: boolean;
  showCreateChannelOverlay: boolean = false;
  @ViewChild(ChatComponent) chatComponent!: ChatComponent;
  threadMenuState: 'opened' | 'closed' = 'opened';
  workspaceMenuState: boolean = false;


  constructor(public chatService: ChatService, private authService: AuthService) {

  }


  ngOnInit(): void {
    this.authService.trackUserPresence(); //Aktiviert das Tracking der User mit Status Online
    this.subscribeToThreadVisibilityStatus();
  }


  /**
   * Subscribes to the visibility status of the thread component
   */
  subscribeToThreadVisibilityStatus() {
    this.chatService.showCurrentThread.subscribe(
      status => { this.threadIsVisible = status }
    );
  }


  /**
   * Hides/Closes the Thread-Component
   */
  closeThread() {
    this.threadMenuState = 'closed';
    setTimeout(() => {
      this.chatService.setThreadVisible(false);
    }, 125);
  }


  /**
   * Toggles visibility for the Create Channel Component
   */
  toggleCreateChannelOverlay() {
    this.showCreateChannelOverlay = !this.showCreateChannelOverlay;
  }


  /**
   * Opens the new message component
   */
  openNewMessage() {
    this.chatComponent.openNewMessageWindow();
  }
}
