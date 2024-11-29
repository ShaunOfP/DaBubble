import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GeneralViewComponent } from './components/general-view/general-view.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'general', component: GeneralViewComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
