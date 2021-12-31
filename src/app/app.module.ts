import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationGuard } from './@guard/authentication.guard';
import { RoleGuard } from './@guard/role.guard';
import { DefaultModule } from './@pages/layout/default/default.module';
import { FullwidthModule } from './@pages/layout/fullwidth/fullwidth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppUtilService } from './@services/app-util.service';
import { AuthInterceptor } from './@interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, DefaultModule, FullwidthModule],

  providers: [
    AuthenticationGuard,
    RoleGuard,
    AppUtilService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
