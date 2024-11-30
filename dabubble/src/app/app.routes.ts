import { Routes } from '@angular/router';
import { LoginComponent } from './components/landing-page/login/login.component';
import { GeneralViewComponent } from './components/general-view/general-view.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PublicChatComponent } from './components/general-view/public-chat/public-chat.component';
import { PrivateChatComponent } from './components/general-view/private-chat/private-chat.component';
import { NewMessageComponent } from './components/general-view/new-message/new-message.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent,
    children:[
      {path: '', component: LoginComponent}
    ]
   },
  { path: 'general', component: GeneralViewComponent,
    children: [
      { path: 'public-chat', component: PublicChatComponent },
      { path: 'privat-chat', component: PrivateChatComponent },
      { path: 'new-message', component: NewMessageComponent },
    ],
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
