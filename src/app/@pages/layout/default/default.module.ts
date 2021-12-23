import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileUserComponent } from 'src/app/@pages/components/profile-user/profile-user.component';
import { ProfileComponent } from 'src/app/@pages/components/profile/profile.component';
import { SharedModule } from 'src/app/@pages/shared/shared.module';
import { DefaultComponent } from './default.component';

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
