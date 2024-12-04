import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from "../../../services/firebase-services/auth.service";
import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  animationPlayed: boolean = false;

  constructor(private router: Router) {
    const animation = sessionStorage.getItem('animation');
    this.animationPlayed = animation === 'true';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    sessionStorage.setItem('animation', 'true');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
