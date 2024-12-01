import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    switch (route) {
      case 'public-chat':
        this.router.navigate(['/general/public-chat']);
        break;
      case 'imprint':
        this.router.navigate(['/imprint']);
        break;
      case 'sign-in':
        this.router.navigate(['/sign-in']);
        break;
      case 'forgot-password':
        this.router.navigate(['/forgot-password']);
        break;
      case 'log-in':
        this.router.navigate(['/']);
        break;
    }
  }
}