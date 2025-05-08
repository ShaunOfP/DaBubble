export class UserDatas {
  username_lowercase: string;
  username: string;
  mail: string;
  password: string;
  avatar: string;
  channels: Array<string>;
  privateChats: Array<string>;
  online: boolean;

  constructor(obj?: UserDatas) {
    this.username_lowercase = obj ? obj.username_lowercase : '';
    this.username = obj ? obj.username : '';
    this.mail = obj ? obj.mail : '';
    this.password = obj ? obj.password : '';
    this.avatar = obj
      ? obj.avatar
      : 'assets/img/avatar1.svg';
    this.channels = obj ? obj.channels : ['ER84UOYc0F2jptDjWxFo'];
    this.privateChats = obj ? obj.privateChats : [];
    this.online = obj ? obj.online : false;
  }
}
