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
  UserCredential
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

  createUserWithEmail(accountData: UserDatas) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, accountData.mail, accountData.password)
      .then((userCredential) => {
        debugger
        const user = userCredential.user;
        console.log(user.uid);
        this.userDataService.saveUser(accountData.name, accountData.accountImg, user.uid)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.userSubject.next(userCredential.user);
      console.log('User log in');
    } catch (error: any) {
      console.error('Error during login:', error.message);
    }
  }

  async googleSignIn(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google Login erfolgreich:', result.user.uid);
      return result; // Gibt UserCredential zurück
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

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Passwort-Zurücksetzungs-E-Mail wurde gesendet.');
    } catch (error) {
      console.error('Fehler beim Senden der Passwort-Zurücksetzungs-E-Mail:', error);
      throw error;
    }
  }

  getUid(): string | null {
    const user = this.currentUser;
    return user ? user.uid : null;
  }
}
