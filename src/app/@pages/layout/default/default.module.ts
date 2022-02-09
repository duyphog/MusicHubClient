import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileUserComponent } from 'src/app/@pages/components/profile-user/profile-user.component';
import { ProfileComponent } from 'src/app/@pages/components/profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { DefaultComponent } from './default.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { HomeComponent } from '../../components/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadSongComponent } from '../../components/upload-song/upload-song.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { AddNewPlaylist, MySongListComponent } from '../../components/my-song-list/my-song-list.component';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import { AlbumComponent } from '../../components/album/album.component';

@NgModule({
  declarations: [
    DefaultComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    ProfileUserComponent,
    ChangePasswordComponent,
    UploadSongComponent,
    MySongListComponent,
    AddNewPlaylist,
    PlaylistComponent,
    AlbumComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    SharedModule,
  ],
})
export class DefaultModule {}
