import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatComponent } from '../chat.component';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';

@Component({
  selector: 'app-user-info-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-info-card.component.html',
  styleUrl: './user-info-card.component.scss'
})
export class UserInfoCardComponent {
  showUserInfoCard: boolean = false;
  currentChannelName: string = '';

  constructor(
    public chatComponent: ChatComponent,
    private chatService: ChatService,
    private userDatasService: UserDatasService
  ){
    if (this.chatService.getCurrentRoute() === 'private'){
      this.currentChannelName = this.chatComponent.currentChannelName;
    } else {
      this.chatComponent.getChannelNameViaId(this.chatComponent.currentChatId);
      this.currentChannelName = this.chatComponent.privateChatOtherUserData.username;
    }
  }

  closeUserInfoCard(){
    this.userDatasService.showUserInfoCard = false;
  }

  openMessageToUser() {
    if (this.chatService.getCurrentRoute() === 'private'){
      this.userDatasService.showUserInfoCard = false;
    } else {
      //implementieren
    }
  }
}
