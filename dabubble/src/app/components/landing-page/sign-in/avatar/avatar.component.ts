import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatCheckboxModule, RouterModule ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  constructor(private router: Router) {}

  avatarList = [
    {
      name: 'avatar1',
      img: 'avatar1.svg'
    },
    {
      name: 'avatar2',
      img: 'avatar2.svg'
    },
    {
      name: 'avatar3',
      img: 'avatar3.svg'
    },
    {
      name: 'avatar4',
      img: 'avatar4.svg'
    },
    {
      name: 'avatar5',
      img: 'avatar5.svg'
    },
    {
      name: 'avatar6',
      img: 'avatar6.svg'
    },
  ]

  createAvatar(){

  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
