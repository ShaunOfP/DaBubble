import { Routes } from '@angular/router';
import { LoginComponent } from './components/landing-page/login/login.component';
import { GeneralViewComponent } from './components/general-view/general-view.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PublicChatComponent } from './components/general-view/public-chat/public-chat.component';
import { PrivateChatComponent } from './components/general-view/private-chat/private-chat.component';
import { NewMessageComponent } from './components/general-view/new-message/new-message.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { WorkspaceMenuComponent } from './components/general-view/workspace-menu/workspace-menu.component';
import { SignInComponent } from './components/landing-page/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/landing-page/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/landing-page/reset-password/reset-password.component';
import { AvatarComponent } from './components/landing-page/sign-in/avatar/avatar.component';
import { UserProfileComponent } from './components/general-view/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent,
    children:[
      {path: '', component: LoginComponent},
      {path: 'sign-in', component: SignInComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'create-avatar', component: AvatarComponent}
    ]
  },
  {
    path: 'general', component: GeneralViewComponent,
    children: [
      { path: 'public-chat', component: PublicChatComponent },
      { path: 'privat-chat', component: PrivateChatComponent },
      { path: 'new-message', component: NewMessageComponent },
      { path: 'user-profile', component: UserProfileComponent },
    ],
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
