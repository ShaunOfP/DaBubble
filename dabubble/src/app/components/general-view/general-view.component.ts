import { Component, Input, input, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { ChatService } from '../../services/firebase-services/chat.service';

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
export class GeneralViewComponent implements OnInit{
  threadIsVisible?: boolean;
  showCreateChannelOverlay: boolean = false;
  @ViewChild(ChatComponent) chatComponent!: ChatComponent;
  threadMenuState: 'opened' | 'closed' = 'opened';
  workspaceMenuState: boolean = false;


  constructor(private chatService : ChatService){

  }

  ngOnInit(): void {
      this.chatService.showCurrentThread.subscribe(
        status => {this.threadIsVisible = status}
      )
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


  openNewMessage() {
    this.chatComponent.openNewMessageWindow();
  }
}
