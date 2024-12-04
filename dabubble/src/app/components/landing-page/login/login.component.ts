import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, FormsModule],
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
