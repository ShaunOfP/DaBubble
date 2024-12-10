import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { UserDatas } from '../../../models/user.class';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  getDocs,
  where,
} from '@angular/fire/firestore';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent /* implements OnInit */ {
  loginForm: FormGroup;
  animationPlayed: boolean = false;
  newGuest: boolean = false;

  private users: UserDatas[] = [];
  private userCount: number | undefined;
  private guestLogin: string | null | undefined;

  guestUser: UserDatas = new UserDatas();

  constructor(
    private router: Router,
    private userService: UserDatasService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    const animation = sessionStorage.getItem('animation');
    this.animationPlayed = animation === 'true';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

/*   async ngOnInit(): Promise<void> {
    this.guestLogin = localStorage.getItem('guestLogin');
    sessionStorage.setItem('animation', 'true');
  } */

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async loadFireStore(): Promise<void> {
    const userCollection: CollectionReference = collection(
      this.userService.firestore,
      'userDatas'
    );

    try {
      const result = await collectionData(userCollection, { idField: 'id' })
        .pipe(take(1))
        .toPromise();
      this.users = result;
      console.log(this.users);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
      throw error;
    }
  }

  async logIn(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        await this.authService.signInWithEmail(email, password);
        console.log('Login erfolgreich!');
        const uid = this.authService.getUid();
        console.log(uid);
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    } else {
      console.error('Formular ist ungültig!');
    }
  }

 

  async checkLogIn(mail: string, password: string): Promise<any | null> {
    await this.loadFireStore();

    const userMail = this.users.find(
      (u) => u.mail === mail && u.password === password
    );

    return userMail || null;
  }

  /* logInGuest() {
    if (this.guestLogin === 'true') {
      console.log('log in as guest');
    } else {
      this.createGuestUser();
    }
  }

  async createGuestUser() {
    this.userCount = Math.floor(Math.random() * 1000000) + 1;
    console.log(this.userCount);
    try {
      const guestUser = {
        name: `Gast${this.userCount}`,
        mail: `guest_${this.userCount}@example.com`,
        password: `guestUser${this.userCount}`,
      };
      this.checkGuestUser(guestUser);
    } catch (err) {
      console.error('Fehler beim Gast-Login:', err);
      throw err;
    }
  }

  async checkGuestUser(guestUser: {
    name: string;
    mail: string;
    password: string;
  }) {
    if (await this.checkExistingGuest(guestUser)) {
      await this.userService.saveUser(guestUser);
      localStorage.setItem('mail', guestUser.mail);
      localStorage.setItem('password', guestUser.password);
      localStorage.setItem('guestLogin', 'true');
    } else {
      this.createGuestUser();
    }
  } */

  async checkExistingGuest(userData: {
    name?: string;
    mail: string;
    password?: string;
  }): Promise<boolean> {
    await this.loadFireStore();

    try {
      const user = this.users.find((u) => u.mail === userData.mail);
      return !user;
    } catch (error) {
      console.error('Fehler bei der Gastbenutzerüberprüfung:', error);
      throw error;
    }
  }
}
