import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MerchantOnboardingComponent } from './pages/merchant-onboarding/merchant-onboarding.component';
import {MerchantOnboarding2Component} from './pages/merchant-onboarding-2/merchant-onboarding-2.component'
import { DashBoardComponent } from './pages/dash-board/dash-board.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { ProfileComponent } from './pages/profile/profile.component';
export const routes: Routes = [
{'path':'login',component:LoginComponent},
{'path':'',component:DashBoardComponent},
{'path':'delivery',component:DeliveryComponent},
{'path':'signUp',component:SignUpComponent},
{'path':'merchantOnboarding',component:MerchantOnboardingComponent},
{'path':'merchantOnboarding_2',component:MerchantOnboarding2Component,},
{'path':'profile',component:ProfileComponent,}
];
