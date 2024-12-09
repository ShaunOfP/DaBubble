export class User {
  name: string;
  mail: string;
  password: string;
 // accountImg: string */

  constructor(obj?: User) {
    this.name = obj ? obj.name : '';
    this.mail = obj ? obj.mail : '';
    this.password = obj ? obj.password : '';
    // this.accountImg = obj ? obj.accountImg : '' 
  }
}
