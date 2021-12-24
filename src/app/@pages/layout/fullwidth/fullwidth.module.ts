import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FullwidthComponent } from './fullwidth.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from '../../components/signin/signin.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { ForbiddenComponent } from '../../components/forbidden/forbidden.component';
import { SignupComponent } from './../../components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FullwidthComponent,
    SigninComponent,
    NotFoundComponent,
    ForbiddenComponent,
    SignupComponent
  ],
  imports: [
  CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class FullwidthModule { }
