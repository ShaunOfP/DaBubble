import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { UserDatas } from '../../../../models/user.class';
import { AuthService } from '../../../../services/firebase-services/auth.service';
import { HeaderSectionComponent } from "../../header-section/header-section.component";
import { FooterComponent } from "../../footer/footer.component";


@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    RouterModule,
    HeaderSectionComponent,
    FooterComponent
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  avatarCreated: boolean = false;
  accountData!: UserDatas;
  avatarList: Array<string> = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];

  constructor(private router: Router, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation != null) {
      this.accountData = navigation?.extras?.state?.['accountData'];
    } else {
      this.navigateTo('sign-in');
    }
  }

  selectAvatar(avatar: string, event: Event): void {
    event.preventDefault();
    this.accountData.avatar = '/img/general-view/create-avatar/' + avatar + '.svg';
  }

  createUser(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      this.authService.createUserWithEmail(this.accountData);
      this.avatarCreated = true;
      setTimeout(() => {
        this.navigateTo('/')
      }, 1000);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}