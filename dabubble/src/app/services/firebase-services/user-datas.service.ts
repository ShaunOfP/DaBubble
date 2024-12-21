import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  setDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDatas } from './../../models/user.class';
import { user } from '@angular/fire/auth';
import { GuestDatas } from '../../models/guest.class';
import { Member } from '../../models/member';

interface SingleUserData {
  mail: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  public firestore = inject(Firestore);
  userDatas$: Observable<UserDatas>;
  found: boolean = false;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private memberList = new BehaviorSubject<Member[]>([]);
  members$: Observable<Member[]> = this.memberList.asObservable();

  constructor() {
    this.userDatas$ = collectionData(this.userDatasRef());
  }

  async saveUser(accountData: UserDatas, userId: string): Promise<void> {
    try {
      const userDocRef = doc(this.userDatasRef(), userId);
      const chatsId = await this.createPrivateChat(userId);
      accountData.privateChats.push(chatsId);

      const userData = {
        username: accountData.name,
        avatar: accountData.accountImg,
        mail: accountData.mail,
        online: accountData.online,
        channels: accountData.channels,
        privateChats: accountData.privateChats,
      };
      await setDoc(userDocRef, userData);

      console.log('✅ Benutzer erfolgreich gespeichert:', userData);
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Benutzers:', error);
    }
  }

  async saveGuest(accountData: GuestDatas, userId: string): Promise<void> {
    try {
      const guestDocRef = doc(this.guestDatasRef(), userId);

      const guestData = {
        username: accountData.username,
        avatar: accountData.avatar,
        channels: accountData.channels
      };
      await setDoc(guestDocRef, guestData);

      console.log('✅ Gast erfolgreich gespeichert:', guestData);
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Gastes:', error);
    }
  }

  async createPrivateChat(userId: string) {
    const generatedId = this.generateRandomId();
    const userDocRef = doc(this.firestore, 'privateChats', generatedId);
    const chatData = {
      createdAt: new Date().getTime(),
      participants: [userId],
    };
    await setDoc(userDocRef, chatData);
    return generatedId;
  }

  generateRandomId() {
    const array = new Uint8Array(22);
    crypto.getRandomValues(array);
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomId = Array.from(
      array,
      (byte) => characters[byte % characters.length]
    ).join('');
    const generatedRandomId = 'pC' + randomId;
    return generatedRandomId;
  }

  async getUserDatas(email: string, password: string) {
    const q = query(this.userDatasRef(), where('mail', '==', email));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as SingleUserData;
        if (userData.password === password) {
          console.log('ID:', doc.id);
          console.log('Data:', userData);
          this.found = true;
        }
      });
      this.found ? false : console.log('falsche Email oder falsches Passwort');
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    try {
      const userData = doc(this.firestore, `userDatas/${userId}`);
      await updateDoc(userData, {
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

  /*   async updateUserPassword(userId: string, newPassword: string) {
    try {
      const UserUpdate = doc(this.userDatasRef(), userId);
      await updateDoc(UserUpdate, {
        password: newPassword,
      });
      console.log('succses', newPassword);
    } catch (err) {
      console.error('Error updation User!', err);
    }
  }
 */
  saveLocalStorage(id: string, name: string) {
    const user = { id, name };
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }

  guestDatasRef() {
    return collection(this.firestore, 'guestDatas');
  }

  async searchUsers(queryString: string): Promise<Member[]> {
    const userQuery = query(
      this.userDatasRef(),
      where('username', '>=', queryString),
      where('username', '<', queryString + '\uf8ff')
    );
  
    try {
      const querySnapshot = await getDocs(userQuery);
      const users: Member[] = [];
      querySnapshot.forEach((doc) => {
        users.push({...(doc.data() as Member) });
      });
      return users;
    } catch (error) {
      console.error('Fehler beim Suchen nach Nutzern:', error);
      return [];
    }
  }

  addMemberToList(member: Member){
    const currentMembers = this.memberList.value;
    this.memberList.next([...currentMembers, member]);
  }

  removeMemberFromList(member: Member){
    const currentMembers = this.memberList.value;
    this.memberList.next(currentMembers.filter(m => m !== member));
  }
}
