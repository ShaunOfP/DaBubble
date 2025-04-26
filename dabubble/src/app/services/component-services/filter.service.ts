import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { ChannelService } from '../firebase-services/channel.service';
import { ChannelMemberService } from '../firebase-services/channel-member.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  allMembers: any;
  allChannels: any;
  query: any;
  channelSearch: boolean = false;
  memberSearch: boolean = false;
  channelMatch: any;
  memberMatch: any;

  constructor(
    private channelService: ChannelService,
    private memberService: ChannelMemberService
  ) {}

  private filterTextSource = new BehaviorSubject<string>('');
  filterText$ = this.filterTextSource.asObservable();
  private channelMatchSource = new BehaviorSubject<any[]>([]);
  channelMatch$ = this.channelMatchSource.asObservable();
  private memberMatchSource = new BehaviorSubject<any[]>([]);
  memberMatch$ = this.memberMatchSource.asObservable();

  updateFilter(text: string) {
    this.filterTextSource.next(text);
    this.searchContent();
  }

  async searchContent() {
    await this.subscribeMembers();
    await this.subscribeChannels();
    this.query = await firstValueFrom(this.filterText$);
    this.channelSearch = this.query.startsWith('#');
    this.memberSearch = this.query.startsWith('@');
    if (this.channelSearch && this.query.length > 1) {
      const searchLower = this.query.substring(1).toLowerCase();
      this.channelMatch = this.allChannels.filter(
        (channels: { channelName: string }) =>
          channels.channelName?.toLowerCase().includes(searchLower)
      );
      this.channelMatchSource.next(this.channelMatch);
    } else if (this.memberSearch && this.query.length > 1) {
      const searchLower = this.query.substring(1).toLowerCase();
      this.memberMatch = this.allMembers.filter(
        (member: { username: string }) =>
          member.username?.toLowerCase().includes(searchLower)
      );
      this.memberMatchSource.next(this.memberMatch);
    }
  }

  async subscribeMembers() {
    this.allMembers = await firstValueFrom(
      this.memberService.allMembersSubject$
    );
    console.log(this.allMembers);
  }

  async subscribeChannels() {
    this.allChannels = await firstValueFrom(this.channelService.channels$);
    console.log(this.allChannels);
  }

  resetSearchResults() {
    this.channelMatchSource.next([]);
    this.memberMatchSource.next([]);
  }
}
