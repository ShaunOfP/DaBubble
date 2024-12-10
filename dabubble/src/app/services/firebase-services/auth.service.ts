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
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserDatas } from '../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {}

  // Google Login
  async googleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.userSubject.next(result.user);
    } catch (error) {
      console.error('Error during Google Sign-In', error);
    }
  }

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
        // Signed up 
        debugger
        const user = userCredential.user;
        console.log(user.uid);
        
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
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

  getUid(): string | null {
    const user = this.currentUser;
    return user ? user.uid : null;
  }
}
