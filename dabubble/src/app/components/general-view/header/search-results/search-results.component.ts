import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '../../../../services/component-services/filter.service';
import { Router } from '@angular/router';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  @Input() inputSearch!: string;
  @Output() closeClicked = new EventEmitter<void>();

  channelResults: any[] = [];
  memberResults: any[] = [];

  constructor(
    private filterService: FilterService,
    private router: Router,
    private userDatasService: UserDatasService
  ) {}

  ngOnInit(): void {
    this.filterService.channelMatch$.subscribe((channels) => {
      this.channelResults = channels;
    });
    this.filterService.memberMatch$.subscribe((members) => {
      this.memberResults = members;
    });
  }

  onCloseClick() {
    this.closeClicked.emit();
    this.filterService.resetSearchResults();
  }

  modifyUrlWithChatString(channelId: string) {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: channelId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.onCloseClick();
  }

  async openDirectMessage(userId: string) {
    const privateChatId = await this.userDatasService.getPrivateChannel(userId);
    this.router.navigate(['/general/private-chat'], {
      queryParams: { chatId: privateChatId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.onCloseClick();
  }
}
