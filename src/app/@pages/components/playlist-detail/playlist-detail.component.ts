import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { CommonService } from 'src/app/@services/common.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { Playlist } from './../../../@model/playlist.model';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { AddNewPlaylist } from '../my-song-list/my-song-list.component';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/@services/authentication.service';
import { Track } from 'src/app/@model/track.model';
import { TrackService } from 'src/app/@services/track.service';
import { AppUtilService } from 'src/app/@services/app-util.service';
import { PlaylistDetail } from './../../../@model/playlist-detail.model';
import { PlaylistDetailUpdate } from './../../../@model/playlist-detail-update.model';
import { AudioService } from 'src/app/@services/audio.service';
import { AppUserService } from './../../../@services/app-user.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionPlaylist: boolean = false;
  chooseOptionSong: boolean = false;

  trackSelected: any[] = [];
  user: any;
  playlistInfo: Playlist;
  listTrackRecommended: Track[] = [];

  constructor(public dialog: MatDialog, public appUserService: AppUserService, private playlistService: PlaylistService, private trackService: TrackService, public appUtilService: AppUtilService, private route: ActivatedRoute, private authenticationService: AuthenticationService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getPlaylistDetail();
    })

    this.trackService.getRecommendedTracks().subscribe((response: any) => {
      this.listTrackRecommended = response.data.content;
    })

    this.user = this.authenticationService.getUserInfoFromLocalCache();
  }

  addTrackToCurrentPlaylist(track: Track): void {
    if (!this.playlistService.checkExistTrackInCurrentPlaylist(track)) {
      this.playlistService.addTrackToCurrentPlaylist(track);
    }
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  getPlaylistDetail() {

    const hasPlaylistId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasPlaylistId) {

      const playlistId = this.route.snapshot.paramMap.get('id');

      this.playlistService.getPlaylist(+playlistId).subscribe((res: any) => {
        this.playlistInfo = res.data;
      });
    }
  }

  likedTrack(id: number) {
    if (this.appUserService.checkExistTrackInTrackLikedList(id)) {
      this.appUserService.updateWhiteList({ trackId: id, isAdd: false }).subscribe((response: any) => {
        this.appUserService.updateTrackLikedFromLocalCache({ trackId: id, isAdd: false });
        this.toastr.success('Đã xóa khỏi danh sách yêu thích');
      });  
    } else {
      this.appUserService.updateWhiteList({ trackId: id, isAdd: true }).subscribe((response: any) => {
        this.appUserService.updateTrackLikedFromLocalCache({ trackId: id, isAdd: true });
        this.toastr.success('Đã thêm vào danh sách yêu thích');
      });
    }
 }

  addTrackToPlaylist(trackId) {
    this.playlistService.updateTrackToDetails({ playlistId: this.playlistInfo.id, trackId: trackId, isRemove: false }).subscribe((response) => {
      this.toastr.success('Thêm bài hát vào playlist thành công');
      this.getPlaylistDetail();
    }, (error: any) => {
      this.toastr.error(error.error.errorMessage);
    });
  }

  removeTrackFromPlaylist() {
    this.trackSelected.forEach((track) => {
      this.playlistService.updateTrackToDetails({ playlistId: this.playlistInfo.id, trackId: track.id, isRemove: true }).subscribe(
        (response: any) => {
          this.toastr.success(`Xóa bài hát ${track.name} khỏi playlist thành công`);
          this.chooseOption = false;
          this.uncheckAfterAction();
          this.getPlaylistDetail();
        }, (error) => {
          this.toastr.error(error.error.errorMessage);
        }
      );
    })
  }

  getTotalDuration(): number {
    let totalDuration: number = 0;
    this.playlistInfo?.playlistDetails.forEach((playlistDetail) => {
      totalDuration += playlistDetail.track.durationSeconds;
    });

    return Math.floor(totalDuration / 60);
  }

  deletePlaylist() {
    this.playlistService.removePlaylist(this.playlistInfo.id).subscribe((response) => {
      this.router.navigateByUrl('/my-song').then(r => this.toastr.success('Xóa playlist thành công'));
      
    }, (error: any) => {
      this.toastr.error(error.error.errorMessage);
    });
  }
  
  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

  openChooseOption(): void {
    this.chooseOption = !this.chooseOption;
  }

  openChooseOptionPlaylist(): void {
    this.chooseOptionPlaylist = !this.chooseOptionPlaylist;
  }
  
  openChooseOptionSong(): void {
    this.chooseOptionSong = !this.chooseOptionSong;
  }

  addToCurrentPlaylist(): void {

    this.trackSelected.forEach((track) => {
      this.trackService.getTrack(track.id).subscribe((response: any) => { 
        if (!this.playlistService.checkExistTrackInCurrentPlaylist(response.data)) {
          this.playlistService.addTrackToCurrentPlaylist(response.data);
        }
      });
    })
    this.toastr.info('Thêm vào danh sách phát thành công');
    this.uncheckAfterAction();
  }

  uncheckAfterAction() {
    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');
    element.forEach((item) => item.classList.remove('is-selected'));
    inputCheckbox.forEach((item) => (item.checked = false));
    this.trackSelected = [];
  }

  playCurrentTrack(id) {
    this.trackService.getTrack(id).subscribe((res: any) => {
      if (!this.playlistService.checkExistTrackInCurrentPlaylist(res.data)) {
        this.playlistService.addTrackToCurrentPlaylist(res.data);
        this.trackService.setCurrentTrack(res.data);
      } else {
        this.trackService.setCurrentTrack(res.data);
      }
    });
  }

  playNextCurrentTrack(trackId: number): void {
    this.trackService.getTrack(trackId).subscribe((response: any) => {
      this.playlistService.playNextCurrentTrack(response.data);
    });
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  addPlaylistToCurrentPlaylist(): void {
    this.playlistInfo.playlistDetails.forEach((playlistDetail) => {
      this.trackService.getTrack(playlistDetail.track.id).subscribe((response: any) => { 
        if (!this.playlistService.checkExistTrackInCurrentPlaylist(response.data)) {
          this.playlistService.addTrackToCurrentPlaylist(response.data);
        }
      });
    });
    this.chooseOptionPlaylist = false;
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  selectedSong(track: Track, item: any): void {

    if (item.className.includes("select-item")) {
      if (item.className.includes("is-selected")){
        item.classList.remove("is-selected");
        this.trackSelected.splice(this.trackSelected.indexOf(track), 1);
      } else {
        this.trackSelected.push(track);
        item.classList.add("is-selected");
      }
    }
  }

  selectAllSong(): void {
    this.selectAll = !this.selectAll;
    var element = document.getElementsByName("select-song");
    var inputCheckbox: any = document.getElementsByName("checkbox-song");

    if (this.selectAll) {
      element.forEach(item => item.classList.add("is-selected"));
      inputCheckbox.forEach(item => item.checked = true);
      this.playlistInfo.playlistDetails.forEach(playlistDetail => this.trackSelected.push(playlistDetail.track));
    } else {
      element.forEach(item => item.classList.remove("is-selected"));
      inputCheckbox.forEach(item => item.checked = false);
      this.trackSelected = [];
    }
  }


}
