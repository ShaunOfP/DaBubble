export class UserDatas {
  name: string;
  mail: string;
  password: string;
  accountImg: string

  constructor(obj?: UserDatas) {
    this.name = obj ? obj.name : '';
    this.mail = obj ? obj.mail : '';
    this.password = obj ? obj.password : '';
    this.accountImg = obj ? obj.accountImg : 'default-avatar' 
  }
}
