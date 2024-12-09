import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { User } from '../../../models/user.class';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  getDocs,
  where,
} from '@angular/fire/firestore';
import { Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  animationPlayed: boolean = false;
  newGuest: boolean = false;

  private users: User[] = [];
  private unsubscribe$ = new Subject<void>();
  private userCount: number | undefined;
  private guestLogin: string | null | undefined;
  private guestMail: string | undefined;
  private guestPassword: string | undefined;

  guestUser: User = new User();

  constructor(
    private router: Router,
    private userService: UserDatasService,
    private authService: AuthService
  ) {
    const animation = sessionStorage.getItem('animation');
    this.animationPlayed = animation === 'true';
  }

  async ngOnInit(): Promise<void> {
    this.guestLogin = localStorage.getItem('guestLogin');
    sessionStorage.setItem('animation', 'true');
  }

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

  async logIn(event: Event): Promise<void> {
    event.preventDefault();

    const mail = (document.getElementById('mail') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const validLogIn = await this.checkLogIn(mail, password);
    console.log(validLogIn);

    if (validLogIn) {
      console.log(validLogIn);
    }
  }

  async checkLogIn(mail: string, password: string): Promise<any | null> {
    await this.loadFireStore();

    const userMail = this.users.find(
      (u) => u.mail === mail && u.password === password
    );

    return userMail || null;
  }

  logInGuest() {
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
  }

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
