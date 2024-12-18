export class GuestDatas {
  username: string;
  avatar: string;
  channels: Array<string>;

  constructor(obj?: Partial<GuestDatas>) {
    this.username = obj?.username || 'Gast';
    this.avatar = obj?.avatar || 'default-avatar';
    this.channels = obj?.channels || ['ER84UOYc0F2jptDjWxFo'];
  }
}