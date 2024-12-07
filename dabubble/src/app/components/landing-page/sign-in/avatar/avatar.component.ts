import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class AvatarComponent implements OnInit {
  selectedAvatar: string | null = null;
  selectedAvatarImg: string = '/img/general-view/create-avatar/default-avatar.svg';
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(){
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  selectAvatar(avatarName: string, avatarImg: string): void {
    this.selectedAvatar = avatarName;
    this.selectedAvatarImg = avatarImg;
  }

  avatarList = [
    {
      name: 'avatar1',
      img: '/img/general-view/create-avatar/avatar1.svg'
    },
    {
      name: 'avatar2',
      img: '/img/general-view/create-avatar/avatar2.svg'
    },
    {
      name: 'avatar3',
      img: '/img/general-view/create-avatar/avatar3.svg'
    },
    {
      name: 'avatar4',
      img: '/img/general-view/create-avatar/avatar4.svg'
    },
    {
      name: 'avatar5',
      img: '/img/general-view/create-avatar/avatar5.svg'
    },
    {
      name: 'avatar6',
      img: '/img/general-view/create-avatar/avatar6.svg'
    },
  ]

  createAvatar(){

  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
