import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DefaultComponent } from './default.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '../../components/profile/profile.component';
import { ProfileUserComponent } from '../../components/profile-user/profile-user.component';

@NgModule({
  declarations: [
    DefaultComponent,
    NavbarComponent,
    ProfileComponent,
    ProfileUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ]
})
export class DefaultModule { }
