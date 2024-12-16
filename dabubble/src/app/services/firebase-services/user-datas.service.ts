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
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDatas } from './../../models/user.class';
import { user } from '@angular/fire/auth';

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

  constructor() {
    this.userDatas$ = collectionData(this.userDatasRef());
    this.getUserDatas('Test@test.de', '123');
  }

  async saveUser( accountData:UserDatas, userId: string): Promise<void> {
    try {
      const userDocRef = doc(this.userDatasRef(), userId);
      const userSnap = await getDoc(userDocRef);
      const chatsId = await this.createPrivateChat(userId)
      accountData.privateChats.push(chatsId)
      if (userSnap.exists()) {
        console.log('Benutzer schon vorhanden', userSnap.data());
      } else {
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
      }
      
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Benutzers:', error);
    }
  }

  async createPrivateChat(userId: String){
    const userDocRef = doc(collection(this.firestore, 'privateChats'));
    const chatData = {
      createdAt: new Date().getTime(),
      participants: [userId]
    }
    setDoc(userDocRef, chatData)
    const docRef = doc(collection(this.firestore, 'privateChats'));
    const docSnap = await getDoc(docRef);
    return docSnap.id
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
}
