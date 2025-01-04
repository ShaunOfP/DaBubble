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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private userDataService: UserDatasService) {}

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
  }

  // Get current user
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async createUserWithEmail(accountData: UserDatas) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, accountData.mail, accountData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        this.userDataService.saveUser(
          accountData,
          user.uid
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('error Code' + errorCode);
        console.error('error Message' + errorMessage);
        
        
      });
  }

  async signInWithEmail(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.userSubject.next(userCredential.user);
      console.log('User log in');
      return userCredential.user
    } catch (error: any) {
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.log(errorCode, errorMessage);
      return errorCode;
    }
  }

  async googleSignIn(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google Login erfolgreich:', result.user.uid);
      console.log('Google Account Image URL:', result.user.photoURL); // Log the image path
      // this.userSubject.next(result.user); // Push the user data to userSubject
      return result; 
    } catch (error) {
      console.error('Fehler beim Google Login:', error);
      return null;
    }
  }

  async guestSignIn() {
    try {
      const result = await signInAnonymously(this.auth);
      console.log(result.user.uid);
    } catch (error) {
      console.error('Gast login nicht verfügbar:', error);
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
    return verifyPasswordResetCode(this.auth, oobCode); // Gibt die E-Mail zurück
  }

  resetPassword(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}
