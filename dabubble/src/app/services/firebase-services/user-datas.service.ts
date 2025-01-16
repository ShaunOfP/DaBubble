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
  docData,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, Subject, map } from 'rxjs';
import { UserDatas } from './../../models/user.class';
import { user } from '@angular/fire/auth';
import { GuestDatas } from '../../models/guest.class';
import { initializeApp } from '@angular/fire/app';
import { ActivatedRoute } from '@angular/router';

interface SingleUserData {
  mail: string;
  password: string;
}

export interface UserObserver {
  avatar: string;
  channels: string[];
  id: string;
  mail: string;
  online: boolean;
  privateChats: string[];
  username: string;
  username_lowercase: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  public firestore = inject(Firestore);
  userDatas$: Observable<UserObserver[]> = new Subject<UserObserver[]>();
  private userIdsSubject = new BehaviorSubject<string[]>([]);
  userIds$ = this.userIdsSubject.asObservable();
  channelData: any = []; //datentyp ändern
  currentUserId: string = ``;

  constructor(private route: ActivatedRoute) {
    this.userDatas$ = collectionData(this.userDatasRef(), { idField: 'id' }) as Observable<UserObserver[]>;
    this.userDatas$
      .pipe(map((users) => users.map((user) => user.id)))
      .subscribe((ids) => this.userIdsSubject.next(ids));
    this.getCurrentChannelId(); //call nach/beim login da sonst fehlermeldung weil zu früh gerufen und keine id in url ist
  }

  async getUserDataById(userId: string): Promise<UserDatas | undefined> {
    const userDocRef = doc(this.firestore, `userDatas/${userId}`);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? (userDoc.data() as UserDatas) : undefined;
  }

  async saveUser(accountData: UserDatas, userId: string): Promise<void> {
    try {
      const userDocRef = doc(this.userDatasRef(), userId);
      const chatsId = await this.createPrivateChat(userId);
      accountData.privateChats.push(chatsId);

      const userData = {
        username_lowercase: accountData.username.toLowerCase(),
        username: accountData.username,
        avatar: accountData.avatar,
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

  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }

  guestDatasRef() {
    return collection(this.firestore, 'guestDatas');
  }


  getCurrentChannelId() {
    this.route.queryParams.subscribe(params => {
      const wholeString = params['userID'];
      const extractedUserID = wholeString.split("/", 1)[0];
      if (extractedUserID) {
        this.currentUserId = extractedUserID;
      }
      else {
        console.error('No user ID provided');
      }
    });
  }


  async updateUserData(userId: string, newMail: string, newUserName: string) {
    try {
      const userData = doc(this.firestore, `userDatas/${userId}`);
      await updateDoc(userData, {
        mail: newMail,
        username: newUserName,
        username_lowercase: newUserName.toLowerCase()
      });
    } catch (err) {
      console.log("Error updating user Data:", err);
    }
  }


  async getChannelNames(channelId: string) {
    const docRef = doc(this.firestore, `channels/${channelId}`);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      this.channelData.push(docSnapshot.data());
      return docSnapshot.data();
    } else {
      return undefined;
    }
  }
}


// async getUserDatas(email: string, password: string) {
//   const q = query(this.userDatasRef(), where('mail', '==', email));
//   try {
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       const userData = doc.data() as SingleUserData;
//       if (userData.password === password) {
//         console.log('ID:', doc.id);
//         console.log('Data:', userData);
//         this.found = true;
//       }
//     });
//     this.found ? false : console.log('falsche Email oder falsches Passwort');
//   } catch (error) {
//     console.error('Error fetching documents:', error);
//   }
// }

// async updateUserAvatar(userId: string, avatarUrl: string) {
//   try {
//     const userData = doc(this.firestore, `userDatas/${userId}`);
//     await updateDoc(userData, {
//       avatar: avatarUrl,
//     });
//   } catch (error) {
//     console.error('Error updating avatar:', error);
//   }
// }

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
// saveLocalStorage(id: string, name: string) {
//   const user = { id, name };
//   localStorage.setItem('user', JSON.stringify(user));
//   this.userSubject.next(user);
// }

// getUserFromStorage() {
//   const user = localStorage.getItem('user');
//   if (user) {
//     this.userSubject.next(JSON.parse(user));
//   }
// }