import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email: string = '';

  onSubmit() {
    if (this.email) {
      console.log(this.email);
    }
  }
}
