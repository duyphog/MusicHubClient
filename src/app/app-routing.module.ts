import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './@pages/components/change-password/change-password.component';
import { ForbiddenComponent } from './@pages/components/forbidden/forbidden.component';
import { HomeComponent } from './@pages/components/home/home.component';
import { NotFoundComponent } from './@pages/components/not-found/not-found.component';
import { ProfileUserComponent } from './@pages/components/profile-user/profile-user.component';
import { ProfileComponent } from './@pages/components/profile/profile.component';
import { SigninComponent } from './@pages/components/signin/signin.component';
import { DefaultComponent } from './@pages/layout/default/default.component';
import { FullwidthComponent } from './@pages/layout/fullwidth/fullwidth.component';

const routes: Routes = [
  {
    path: '', component: DefaultComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile-user', component: ProfileUserComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ]
  },
  {
    path: '', component: FullwidthComponent, children: [
      { path: 'signin', component: SigninComponent },
      { path: 'notfound', component: NotFoundComponent },
      { path: 'forbidden', component: ForbiddenComponent },
    ]
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
