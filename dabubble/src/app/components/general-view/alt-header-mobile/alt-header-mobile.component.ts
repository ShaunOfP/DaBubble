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


  /**
   * Calls function to make other Component visible again
   */
  goBackToWorkspaceMenu() {
    this.hideAltHeader();
  }


  /**
   * Changes boolean of variables to hide the component
   */
  hideAltHeader() {
    this.chatService.showChatWhenResponsive = false;
    this.chatService.showAltHeader = false;
  }
}
