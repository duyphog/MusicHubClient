import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MusicBarComponent } from './music-bar/music-bar.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MusicBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports: [
    HeaderComponent,
    MusicBarComponent
  ]
})
export class SharedModule { }
