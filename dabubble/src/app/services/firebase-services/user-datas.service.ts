import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDatas } from './../../models/user.class';
import { GuestDatas } from '../../models/guest.class';
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
  userIdsSubject = new BehaviorSubject<string[]>([]);
  userIds$ = this.userIdsSubject.asObservable();
  channelData: any = [];
  currentUserId: string = ``;
  showUserInfoCard: boolean = false;
  private currentUserDataSubject = new BehaviorSubject<UserObserver | null>(
    null
  );
  public currentUserData$: Observable<UserObserver | null> =
    this.currentUserDataSubject.asObservable();

  constructor(private route: ActivatedRoute) { }


  /**
   * Console Logs the Users that are online
   */
  async getOnlineUsers() {
    const usersRef = collection(this.firestore, 'users');
    const onlineUsersQuery = query(usersRef, where('isOnline', '==', true));
    const querySnapshot = await getDocs(onlineUsersQuery);

    querySnapshot.forEach((doc) => {
      console.log(`User ID: ${doc.id}, Data:`, doc.data());
    });
  }


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
        this.currentUserId = 'guest';
      } else {
        if (userID === 'guest') {
          this.currentUserId = 'guest';
        } else {
          this.currentUserDataSubject.next(null);
        }
      }
    });
  }

  async getUserName(id: string): Promise<string> {
    try {
      const docRef = doc(this.userDatasRef(), id);
      const guestDocRef = doc(this.guestDatasRef(), id);

      const [docSnap, guestSnap] = await Promise.all([
        getDoc(docRef),
        getDoc(guestDocRef),
      ]);

      if (docSnap.exists()) {
        return docSnap.data()['username'] as string;
      } else if (guestSnap.exists()) {
        return guestSnap.data()['username'] as string;
      } else {
        if (this.checkIfGuestIsLoggedIn()) {
          return 'Guest';
        } else return '';
      }
    } catch (error) {
      return 'noUser';
    }
  }

  guestDatasRef() {
    return collection(this.firestore, 'guestDatas');
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
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Gastes:', error);
    }
  }

  /**
   * Takes an id-string and returns the matching Data from the Database
   * @param userId the id for which the data is searched
   * @returns The Object with the userData from the Database
   */
  async getSingleUserData(userId: string) {
    if (userId === 'Private Chat doesnt exist') return;
    const userDataSnapshot = await getDoc(doc(this.userDatasRef(), userId));
    if (userDataSnapshot.exists()) {
      return { id: userDataSnapshot.id, ...userDataSnapshot.data() } as any;
    } else {
      console.error('User doesnt exist in the database');
      return;
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

  checkIfGuestIsLoggedIn(): boolean {
    this.getCurrentUserId();
    return this.currentUserId === 'guest' ? true : false;
  }

  getCurrentUserId() {
    this.route.queryParams.subscribe((params) => {
      if (params['userID']) {
        if (params['userID'] != 'guest') {
          this.currentUserId = params['userID'];
        } else {
          this.currentUserId = 'guest';
        }
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


  /**
   * Fetches the URL of the Avatar(IMG) for the Chat
   * @param id ID of the currently logged in User
   * @returns a string containing the URL of the Avatar of the currently logged in User
   */
  async getUserAvatar(id: string): Promise<string> {
    return this.getSingleUserData(id).then(result => {
      if (result && result.avatar) {
        return result.avatar;
      } else {
        return "/img/general-view/create-avatar/default-avatar.svg";
      }
    });
  }


  async getPrivateChannel(userId: string) {
    const userDocRef = doc(this.firestore, `userDatas/${userId}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.get('privateChats');
    }
  }

  /**
   * Removes a channel from the Userdata of the currently logged in User
   * @param channelData Data from the current Channel
   */
  async removeChannelFromUserData(channelData: string[], channelId: string) {
    console.log(channelData);
    this.getCurrentUserId();
    let channelArray = channelData;
    channelArray = channelArray.filter(
      (channel: string) => channel !== channelId
    );
    console.log(channelArray);
    const docRef = doc(this.firestore, 'userDatas', this.currentUserId);
    await updateDoc(docRef, {
      channels: channelArray,
    });
  }

  /**
   * Alternative way of getting the current User Data
   * @returns Data of the currently logged in User
   */
  async getCurrentUserData() {
    let data = await getDoc(
      doc(this.firestore, 'userDatas', this.currentUserId)
    );
    if (data.exists()) {
      return data.data();
    } else {
      return 'No data found';
    }
  }

  async refreshCurrentUserData(userId: string) {
    const userDocRef = doc(this.firestore, `userDatas/${userId}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserObserver;
      this.currentUserDataSubject.next(userData);
    } else {
      console.error('User not found');
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
