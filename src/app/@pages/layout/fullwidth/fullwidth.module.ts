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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    FullwidthComponent,
    SigninComponent,
    NotFoundComponent,
    ForbiddenComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  imports: [
  CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({ timeOut: 5000, positionClass: "toast-bottom-right", preventDuplicates: true }),
    SharedModule
  ]
})
export class FullwidthModule { }
