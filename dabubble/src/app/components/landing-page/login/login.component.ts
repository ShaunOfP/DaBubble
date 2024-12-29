import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatas } from '../../../models/user.class';
import { GuestDatas } from '../../../models/guest.class';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userDatas$: Observable<UserDatas>;
  loginForm: FormGroup;
  animationPlayed: boolean = false;
  user: UserDatas = new UserDatas();
  guest: GuestDatas = new GuestDatas();
  loginErrorMail: string | null = null;
  loginErrorPassword: string | null = null;

  constructor(
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserDatasService,
    private form: FormBuilder
  ) {
    this.userDatas$ = collectionData(this.userDatasRef());
    const animation = sessionStorage.getItem('animation');
    this.animationPlayed = animation === 'true';

    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async ngOnInit(): Promise<void> {
    sessionStorage.setItem('animation', 'true');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async logIn(): Promise<void> {
    this.resetLoginError();
  
    if (this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      const { email, password } = this.loginForm.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(email)) {
        this.loginErrorMail = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      }
  
      try {
        const result = await this.authService.signInWithEmail(email, password);
        console.log(result);
        this.handleLogin(result);

      } catch (error ) {
        console.error('Fehler beim log in:', error);
      }

    } else {
      this.loginErrorMail = 'Gib hier deine gültige Email ein';
      this.loginErrorPassword = 'Gib hier dein gültiges Passwort ein';
    }
  }

  handleLogin(result: any) {
    console.log(result.uid);
    if (result === 'auth/user-not-found') {
      this.loginErrorMail = 'Die E-Mail-Adresse ist nicht angemeldet!';
      console.log(this.loginErrorMail);
    } else if (result === 'auth/wrong-password') {
      this.loginErrorPassword = 'Das Passwort ist ungültig!';
    } else {
      this.router.navigate([`/general`], { queryParams: { userID: result?.uid } });
    }
  }
  
  resetLoginError() {
    this.loginErrorMail = '';
    this.loginErrorPassword = ''; 
  }

  async guestLogIn() {
    try {
      await this.authService.guestSignIn();
      const guestUser = this.authService.currentUser;
      const guestDocRef = doc(this.guestDatasRef(), guestUser?.uid);
      const guestSnap = await getDoc(guestDocRef);
      if (guestSnap.exists()) {
        console.log('Gast schon vorhanden', guestSnap.data());
        this.router.navigate(['/general']);
      } else {
        if (guestUser) {
          const newGuest: GuestDatas = new GuestDatas({
            username: 'Gast',
            avatar: 'default-avatar',
            channels: ['ER84UOYc0F2jptDjWxFo'],
          });
          this.userService.saveGuest(newGuest, guestUser.uid);
          this.router.navigate(['/general']);
          console.log(newGuest);
          console.log(guestUser.uid);
        }
      }

    } catch (error) {
      console.error('Fehler beim Gast log in:', error);
    }
  }

  async googleLogIn() {
    try {
      await this.authService.googleSignIn();
      console.log('Erfolgreich mit Google eingelogt');
      const googleUser = this.authService.currentUser;
      console.log('User is', googleUser?.displayName);
      const userDocRef = doc(this.userDatasRef(), googleUser?.uid);
      const userSnap = await getDoc(userDocRef);
      console.log(this.user);
      this.router.navigate([`/general/public-chat`], { queryParams: { userID: googleUser?.uid } });
      if (userSnap.exists()) {
        console.log('Benutzer schon vorhanden', userSnap.data());

      } else {
        if (googleUser) {
          this.setNewUser(googleUser);
        }
      }
    } catch (error) {
      console.error('Google Log In fehlgeschlagen.', error);
    }
  }

  async setNewUser(user: User) {
    const newUser: UserDatas = new UserDatas({
      username: user.displayName ?? '',
      mail: user.email ?? '',
      password: '',
      avatar: user.photoURL ?? 'default-avatar',
      channels: ['ER84UOYc0F2jptDjWxFo'],
      privateChats: [],
      online: false,
    });
    await this.userService.saveUser(newUser, user.uid);
    this.router.navigate(['/general']);
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }

  guestDatasRef() {
    return collection(this.firestore, 'guestDatas');
  }
}
