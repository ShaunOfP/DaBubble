import { Component } from '@angular/core';
import { ChatDetailsComponent } from "../chat-details/chat-details.component";
import { ChannelMembersComponent } from "../channel-members/channel-members.component";
import { AddMembersComponent } from "../add-members/add-members.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatDetailsComponent, ChannelMembersComponent, AddMembersComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  /**
   * Removes class to display the Chat Details Menu
   */
  openChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  }


  /**
   * Adds class to no longer display the Chat Details Menu
   */
  closeChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.add('d-none');
  }


  /**
   * Removes class to display the Members Info Menu
   */
  openMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.remove('d-none');
  }


  /**
   * Adds class to no longer display the Members Info Menu
   */
  closeMembersInfo(){
    document.getElementById('channelMembersMenu')?.classList.add('d-none');
  }

  
  /**
   * Removes class to display the Add Members menu; "closes" the Members Info Menu if still open
   */
  openAddMembersMenu() {
    if (!document.getElementById('channelMembersMenu')?.classList.contains('d-none')){
      this.closeMembersInfo();
    }
    document.getElementById('addMembersMenu')?.classList.remove('d-none');
  }


  /**
   * Adds class to no longer display Add Members menu
   */
  closeAddMembersMenu(){
    document.getElementById('addMembersMenu')?.classList.add('d-none');
  }
}
