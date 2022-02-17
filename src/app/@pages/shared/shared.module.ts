import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MusicBarComponent } from './music-bar/music-bar.component';
import { DragDropFileUploadDirective } from './../../@directive/drag-drop-file-upload.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderComponent,
    MusicBarComponent,
    DragDropFileUploadDirective,
  ],
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [HeaderComponent, MusicBarComponent],
})
export class SharedModule {}
