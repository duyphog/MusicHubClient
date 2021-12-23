import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FullwidthComponent } from './fullwidth.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from '../../components/signin/signin.component';

@NgModule({
  declarations: [
    FullwidthComponent,
    SigninComponent,
  ],
  imports: [
  
  CommonModule,
    RouterModule
  ]
})
export class FullwidthModule { }
