import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User, getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

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

  createUserWithEmail(email:string, password: string){
    const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }

}