export class UserDatas {
  name: string;
  mail: string;
  password: string;
  accountImg: string;
  channels: Array<string>;
  privateChats: Array<string>;
  online: boolean;

  constructor(obj?: UserDatas) {
    this.name = obj ? obj.name : '';
    this.mail = obj ? obj.mail : '';
    this.password = obj ? obj.password : '';
    this.accountImg = obj ? obj.accountImg : 'default-avatar';
    this.channels = obj ? obj.channels: ['ER84UOYc0F2jptDjWxFo'];
    this.privateChats = obj ? obj.privateChats: [];
    this.online = obj ? obj.online: false;
  }
}
