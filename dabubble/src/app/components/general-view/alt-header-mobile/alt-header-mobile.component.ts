import { Component } from '@angular/core';
import { ChatService } from '../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-alt-header-mobile',
  standalone: true,
  imports: [],
  templateUrl: './alt-header-mobile.component.html',
  styleUrl: './alt-header-mobile.component.scss'
})
export class AltHeaderMobileComponent {
  constructor(public chatService: ChatService) {

  }

  goBackToWorkspaceMenu() {
    this.hideAltHeader();
  }

  hideAltHeader() {
    this.chatService.showChatWhenResponsive = false;
    this.chatService.showAltHeader = false;
  }
}
