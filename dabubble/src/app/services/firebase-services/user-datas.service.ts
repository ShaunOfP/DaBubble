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
import { Observable, BehaviorSubject, Subject, map, take } from 'rxjs';
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
  private firestore = inject(Firestore);
  // userDatas$: Observable<UserObserver[]> = new Subject<UserObserver[]>();
  userIdsSubject = new BehaviorSubject<string[]>([]);
  userIds$ = this.userIdsSubject.asObservable();
  channelData: any = []; //datentyp ändern
  currentUserId: string = ``;
  private currentUserDataSubject = new BehaviorSubject<UserObserver | null>(
    null
  );
  public currentUserData$: Observable<UserObserver | null> =
    this.currentUserDataSubject.asObservable();

  constructor(private route: ActivatedRoute) { }

  async getUserDataById(): Promise<void> {
    this.route.queryParams.pipe().subscribe(async (params) => {
      const userID = params['userID'];
      const userDocRef = doc(this.firestore, `userDatas/${userID}`);
      const guestDocRef = doc(this.firestore, `guestDatas/${userID}`);
      const [userDoc, guestDoc] = await Promise.all([
        getDoc(userDocRef),
        getDoc(guestDocRef),
      ]);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserObserver;
        this.currentUserDataSubject.next(userData);
      } else if (guestDoc.exists()) {
        const userData = guestDoc.data() as UserObserver;
        this.currentUserDataSubject.next(userData);
      } else {
        console.error('User not found');
        this.currentUserDataSubject.next(null);
      }
    });
  }

  async getUserName(id: string): Promise<string> {
    try {
      const docRef = doc(this.userDatasRef(), id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()['username'] as string
      }
      else {
        return ""
      }
    } catch (error) {
      return 'noUser'
    }
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
        channels: accountData.channels,
        privateChats: accountData.privateChats,
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

  async getCurrentChannelId() {
    this.route.queryParams.subscribe((params) => {
      const wholeString = params['userID'];
      const extractedUserID = wholeString.split('/', 1)[0];
      if (extractedUserID) {
        this.currentUserId = extractedUserID;
        console.log(this.currentUserId);
      } else {
        console.error('No user ID provided');
      }
    });
  }

  async updateUserData(userId: string, newUserName: string) {
    try {
      const userData = doc(this.firestore, `userDatas/${userId}`);
      await updateDoc(userData, {
        username: newUserName,
        username_lowercase: newUserName.toLowerCase(),
      });
    } catch (err) {
      console.log('Error updating user Data:', err);
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

  async getPrivateChannel(userId: string) {
    const userDocRef = doc(this.firestore, `userDatas/${userId}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.get('privateChats');
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
