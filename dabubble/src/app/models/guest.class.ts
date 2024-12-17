export class GuestDatas {
  name: string;
  accountImg: string;
  channels: Array<string>;

  constructor(obj?: Partial<GuestDatas>) {
    this.name = obj?.name || 'Gast';
    this.accountImg = obj?.accountImg || 'default-avatar';
    this.channels = obj?.channels || ['ER84UOYc0F2jptDjWxFo'];
  }
}
