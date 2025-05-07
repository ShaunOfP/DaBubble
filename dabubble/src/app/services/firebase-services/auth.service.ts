import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  UserCredential,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserDatas } from '../../models/user.class';
import { UserDatasService } from './user-datas.service';
import { Database, ref, onDisconnect, set, serverTimestamp } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private userDataService: UserDatasService, private db: Database) { }


  /**
   * Tracks if User is online/offline
   */
  trackUserPresence() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const userStatusRef = ref(this.db, `status/${user.uid}`);
        set(userStatusRef, { state: 'online', lastChanged: serverTimestamp() });
        onDisconnect(userStatusRef).set({ state: 'offline', lastChanged: serverTimestamp() });
      }
    });
  }


  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
  }


  get currentUser(): User | null {
    return this.auth.currentUser;
  }


  async createUserWithEmail(accountData: UserDatas) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, accountData.mail, accountData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.userDataService.saveUser(
          accountData,
          user.uid
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        console.error('error Code' + errorCode);
      });
  }


  async signInWithEmail(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.userSubject.next(userCredential.user);
      return userCredential.user
    } catch (error: any) {
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.error(errorCode, errorMessage);
      return errorCode;
    }
  }


  async googleSignIn(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('Fehler beim Google Login:', error);
      return null;
    }
  }


  resetPasswordLink(
    email: string,
    onSuccess: () => void,
    onError: (errorCode: string, errorMessage: string) => void
  ) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        onError(errorCode, errorMessage);
      });
  }


  verifyCode(oobCode: string): Promise<string> {
    return verifyPasswordResetCode(this.auth, oobCode);
  }


  resetPassword(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}
