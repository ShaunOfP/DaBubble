export class User {
  firstName: string;
  lastName: string;
  email: string;

  constructor(obj?: User) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
  }
}
