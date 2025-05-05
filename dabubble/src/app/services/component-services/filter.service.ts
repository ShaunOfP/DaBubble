import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { ChannelService } from '../firebase-services/channel.service';
import { ChannelMemberService } from '../firebase-services/channel-member.service';
import { Message } from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  allMembers: any;
  allChannels: any;
  allMessages: any;
  query: string = '';
  channelSearch: boolean = false;
  memberSearch: boolean = false;
  channelMatch: any;
  memberMatch: any;
  private messageMatchSubject = new BehaviorSubject<Message[]>([]);
  messageMatch$ = this.messageMatchSubject.asObservable();
  private filterTextSource = new BehaviorSubject<string>('');
  filterText$ = this.filterTextSource.asObservable();
  private channelMatchSource = new BehaviorSubject<any[]>([]);
  channelMatch$ = this.channelMatchSource.asObservable();
  private memberMatchSource = new BehaviorSubject<any[]>([]);
  memberMatch$ = this.memberMatchSource.asObservable();
  private destroy$ = new Subject<void>();

  constructor(
    private channelService: ChannelService,
    private memberService: ChannelMemberService
  ) { }


  updateFilter(text: string) {
    this.filterTextSource.next(text);
    this.searchContent();
  }


  async searchContent() {
    await this.subscribeMembers();
    await this.subscribeChannels();
    await this.subscribeMessages();
    this.query = await firstValueFrom(this.filterText$);
    this.channelSearch = this.query.startsWith('#');
    this.memberSearch = this.query.startsWith('@');
    if (this.channelSearch && this.query.length > 0) {
      this.searchForChannels();
    } else if (this.memberSearch && this.query.length > 0) {
      this.searchForMembers();
    } else if (this.query.length > 0) {
      this.searchForMessages();
    } else {
      this.query = '';
      this.resetSearchResults();
    }
  }


  searchForChannels() {
    const searchLower = this.query.substring(1).toLowerCase();
    this.channelMatch = this.allChannels.filter(
      (channels: { channelName: string }) =>
        channels.channelName?.toLowerCase().includes(searchLower)
    );
    this.channelMatchSource.next(this.channelMatch);
  }


  searchForMembers() {
    const searchLower = this.query.substring(1).toLowerCase();
    this.memberMatch = this.allMembers.filter(
      (member: { username: string }) =>
        member.username?.toLowerCase().includes(searchLower)
    );
    this.memberMatchSource.next(this.memberMatch);
  }


  searchForMessages() {
    this.channelService.messages$.pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const searchLower = this.query.substring(1).toLowerCase();
        let messageMatch = searchLower ? result.filter(msg => msg.content.toLowerCase().includes(searchLower)) : result;
        this.messageMatchSubject.next(messageMatch);
      });
  }


  async subscribeMembers() {
    this.allMembers = await firstValueFrom(
      this.memberService.allMembersSubject$
    );
  }

  async subscribeChannels() {
    this.allChannels = await firstValueFrom(this.channelService.channels$);
  }

  async subscribeMessages() {
    this.allMessages = await firstValueFrom(this.channelService.messages$);
  }


  resetSearchResults() {
    this.channelMatchSource.next([]);
    this.memberMatchSource.next([]);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
