import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultModule } from './@pages/layout/default/default.module';
import { FullwidthModule } from './@pages/layout/fullwidth/fullwidth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultModule,
    FullwidthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
