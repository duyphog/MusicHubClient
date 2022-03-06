import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './@guard/authentication.guard';
import { AlbumComponent } from './@pages/components/album/album.component';
import { ChangePasswordComponent } from './@pages/components/change-password/change-password.component';
import { ForbiddenComponent } from './@pages/components/forbidden/forbidden.component';
import { HomeComponent } from './@pages/components/home/home.component';
import { MySongListComponent } from './@pages/components/my-song-list/my-song-list.component';
import { NotFoundComponent } from './@pages/components/not-found/not-found.component';
import { PlaylistDetailComponent } from './@pages/components/playlist-detail/playlist-detail.component';
import { ProfileUserComponent } from './@pages/components/profile-user/profile-user.component';
import { ProfileComponent } from './@pages/components/profile/profile.component';
import { SigninComponent } from './@pages/components/signin/signin.component';
import { SignupComponent } from './@pages/components/signup/signup.component';
import { UploadSongComponent } from './@pages/components/upload-song/upload-song.component';
import { DefaultComponent } from './@pages/layout/default/default.component';
import { FullwidthComponent } from './@pages/layout/fullwidth/fullwidth.component';
import { TrackAndAlbumComponent } from './@pages/components/track-and-album-list/track-and-album-list.component';
import { ForgotPasswordComponent } from './@pages/components/forgot-password/forgot-password.component';
import { PlaylistComponent } from './@pages/components/playlist/playlist.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'profile-user',
        component: ProfileUserComponent,
        canActivate: [AuthenticationGuard],
      },
      { path: 'change-password', component: ChangePasswordComponent },
      {
        path: 'upload-song',
        component: UploadSongComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'my-song',
        component: MySongListComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'playlist-detail',
        component: PlaylistDetailComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'playlist',
        component: PlaylistComponent,
      },
      { path: 'album/:id', component: AlbumComponent },
      { path: 'genre/:category-id/:genre-id', component: TrackAndAlbumComponent },
    ],
  },
  {
    path: '',
    component: FullwidthComponent,
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'notfound', component: NotFoundComponent },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
