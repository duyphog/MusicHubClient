import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MusicBarComponent } from './music-bar/music-bar.component';
import { DragDropFileUploadDirective } from './../../@directive/drag-drop-file-upload.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    HeaderComponent,
    MusicBarComponent,
    SearchComponent,
    DragDropFileUploadDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],

  exports: [HeaderComponent, MusicBarComponent, SearchComponent],
})
export class SharedModule {}
