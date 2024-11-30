import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatCheckboxModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
name = "";
mail = "";
password = "";

}
