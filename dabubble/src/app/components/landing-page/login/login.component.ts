import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatas } from '../../../models/user.class';
import { GuestDatas } from "../../../models/guest.class";
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
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(this.loginForm.value.mail);

      try {
        await this.authService.signInWithEmail(email, password);
        console.log('Login erfolgreich!');
        /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    } else {
      console.error('Formular ist ungültig!');
      this.loginForm.markAllAsTouched();
    }
  }

  async guestLogIn() {
    try {
      await this.authService.guestSignIn();
      const guestUser = this.authService.currentUser;
      const guestDocRef = doc(this.guestDatasRef(), guestUser?.uid);
      const guestSnap = await getDoc(guestDocRef);
      if (guestSnap.exists()) {
        console.log('Gast schon vorhanden', guestSnap.data());
      } else {
        if (guestUser) {
          const newGuest: GuestDatas = new GuestDatas({
            name: 'Gast',
            accountImg: 'default-avatar',
            channels: ['ER84UOYc0F2jptDjWxFo'],
          })
          console.log(newGuest)
          console.log(guestUser.uid);
        }
      }


      /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
    } catch (error) {
      console.error('Fehler beim Gast log in:', error);
    }
  }

  async googleLogIn() {
    try {
      await this.authService.googleSignIn();
      console.log('Erfolgreich mit Google eingelogt');
      /* this.router.navigate(['create-avatar']); */
      const googleUser = this.authService.currentUser;
      const userDocRef = doc(this.userDatasRef(), googleUser?.uid);
      const userSnap = await getDoc(userDocRef);
      console.log(this.user);
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
      name: user.displayName ?? '',
      mail: user.email ?? '',
      password: '',
      accountImg: user.photoURL ?? 'default-avatar',
      channels: ['ER84UOYc0F2jptDjWxFo'],
      privateChats: [],
      online: false,
    });
    await this.userService.saveUser(newUser, user.uid);
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
