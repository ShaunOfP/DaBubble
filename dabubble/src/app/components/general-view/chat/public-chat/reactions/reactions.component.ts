import { Component, Input } from '@angular/core';
import { Message } from '../../../../../models/interfaces';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.scss'
})
export class ReactionsComponent {
  @Input() message!: any;
  @Input() hoveredMessageId!: string | null
  showPopoverReaction: number | null = null;
  reactionUserNamesCache: { [key: number]: string[] } = {};
  reactionEntriesList: { isImage: boolean; value: string; count: number; users: string[] }[]  = [];

  constructor(
    private userDataService: UserDatasService,
    private route: ActivatedRoute,
  ) { }


  ngOnChanges(){
    this.reactionEntriesList = this.createReactionEntries(this.message);
  }


  createReactionEntries(message: Message): {
    isImage: boolean;
    value: string;
    count: number;
    users: string[];
  }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => {
      if (emoji === 'green_check') {
        return {
          isImage: true,
          value: 'assets/img/green_check.svg',
          count: (users as string[]).length,
          users: users as string[],
        };
      } else {
        return {
          isImage: false,
          value: emoji,
          count: (users as string[]).length,
          users: users as string[],
        };
      }
    });
  }


  async showPopover(index: number, users: string[]) {
    if (!this.reactionUserNamesCache[index]) {
      this.reactionUserNamesCache[index] = await this.formatUserNames(users);
    }
    this.showPopoverReaction = index;
  }

  hidePopover() {
    this.showPopoverReaction = null;
  }

  async formatUserNames(users: string[]): Promise<string[]> {
    let formattedNames = await Promise.all(
      users.map(async (id) => id === this.userDataService.currentUserId ? "Du" : await this.userDataService.getUserName(id))
    );
    const yourself = formattedNames.includes("Du");
    formattedNames = formattedNames.filter(name => name !== "Du");
    let maxNames = yourself ? 1 : 2;
    let result = formattedNames.slice(0, maxNames);
    if (yourself) {
      result.push("Du");
    }
    return result;
  }

  checkStyle(userId: string): string {
    let currentUser: string = '';
    this.route.queryParams.subscribe((params) => {
      currentUser = params['userID'];
    });
    return userId === currentUser ? 'secondary' : 'primary';
  }

  updateReaction(emoji: string) {
    console.log(emoji);
  }
}
