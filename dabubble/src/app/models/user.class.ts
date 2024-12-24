export class UserDatas {
  username: string;
  mail: string;
  password: string;
  avatar: string;
  channels: Array<string>;
  privateChats: Array<string>;
  online: boolean;

  constructor(obj?: UserDatas) {
    this.username = obj ? obj.username : '';
    this.mail = obj ? obj.mail : '';
    this.password = obj ? obj.password : '';
    this.avatar = obj ? obj.avatar : 'default-avatar';
    this.channels = obj ? obj.channels: ['ER84UOYc0F2jptDjWxFo'];
    this.privateChats = obj ? obj.privateChats: [];
    this.online = obj ? obj.online: false;
  }
}
