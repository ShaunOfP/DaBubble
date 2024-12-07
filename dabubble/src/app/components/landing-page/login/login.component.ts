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
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  animationPlayed: boolean = false;

  private users$: Observable<any[]> | undefined;
  private unsubscribe$ = new Subject<void>();
  private userCount: number | undefined;

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
    sessionStorage.setItem('animation', 'true');
    const userCollection = collection(this.userService.firestore, 'userDatas');
    this.users$ = collectionData(userCollection);
    await this.users$?.subscribe((users) => {
      console.log(users);
      this.userCount = users.length + Math.floor(Math.random() * 100000);
      console.log(this.userCount);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async createGuestUser() {
    try {
      const guestUser = {
        name: `guest${this.userCount}`,
        mail: `guest_${this.userCount}@example.com`,
        password: `guestUser${this.userCount}`,
      };

      await this.userService.saveUser(guestUser);
      localStorage.setItem('mail', guestUser.mail);
      localStorage.setItem('password', guestUser.password);
    } catch (err) {
      console.error('Fehler beim Gast-Login:', err);
      throw err;
    }
  }
}
