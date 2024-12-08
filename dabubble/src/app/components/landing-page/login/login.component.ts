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
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  animationPlayed: boolean = false;
  newGuest: boolean = false;

  private users$: Observable<any[]> | undefined;
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
    const userCollection = collection(this.userService.firestore, 'userDatas');
    this.users$ = collectionData(userCollection);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logInGuest() {
    if (this.guestLogin === 'true') {
      console.log('log in as guest');
    }
    else {
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
      }
      this.checkGuestUser(guestUser);

    } catch (err) {
      console.error('Fehler beim Gast-Login:', err);
      throw err;
    }
  }

  async checkGuestUser(guestUser: { name: string; mail: string; password: string; }) {
    if (await this.checkExistingGuest(guestUser)) {
      await this.userService.saveUser(guestUser);
      localStorage.setItem('mail', guestUser.mail);
      localStorage.setItem('password', guestUser.password);
      localStorage.setItem('guestLogin', 'true');
    } else {
      this.createGuestUser();
    }
  }

  async checkExistingGuest(userData: { name?: string; mail: any; password?: string }): Promise<boolean> {
    return new Promise((resolve) => {
      this.users$?.pipe(take(1)).subscribe((users) => {
        const user = users.find((u) => u.mail === userData.mail);
        resolve(!user); 
      });
    });
  }
}
