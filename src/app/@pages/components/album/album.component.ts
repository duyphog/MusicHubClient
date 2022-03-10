import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/@model/album.model';
import { Track } from 'src/app/@model/track.model';
import { AlbumService } from './../../../@services/album.service';
import { AppUtilService } from './../../../@services/app-util.service';
import { TrackService } from './../../../@services/track.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { ToastrService } from 'ngx-toastr';
import { AudioService } from './../../../@services/audio.service';
import { CommonService } from 'src/app/@services/common.service';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { Playlist } from 'src/app/@model/playlist.model';
import { FormGroup } from '@angular/forms';
import { AddNewPlaylist } from '../my-song-list/my-song-list.component';
import { PlaylistDetail } from './../../../@model/playlist-detail.model';
import { AppUserService } from 'src/app/@services/app-user.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionAlbum: boolean = false;
  chooseOptionTrack: boolean[] = [];
  chooseOptionOtherTrack: boolean = false;

  trackSelected: Track[] = [];

  albumInfo: Album;
  trackInfo: Track;

  status: string = 'start';

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private albumService: AlbumService, public appUtilService: AppUtilService, public trackService: TrackService, public playlistService: PlaylistService, private toastr: ToastrService, public appUserService: AppUserService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAlbumDetail();
    })
  }

  getAlbumDetail() {

    const hasAlbumId: boolean = this.route.snapshot.paramMap.has('id');
    const hasTrackId: boolean = this.route.snapshot.paramMap.has('trackId');

    if (hasAlbumId) {

      const albumId = this.route.snapshot.paramMap.get('id');

      this.albumService.getAlbumDetail(+albumId).subscribe((res: any) => {
        this.albumInfo = res.data;
      });
    } else if (hasTrackId) {
        
        const trackId = this.route.snapshot.paramMap.get('trackId');
  
        this.trackService.getTrack(+trackId).subscribe((res: any) => {
          this.trackInfo = res.data;
        });
    }
    
  }

  getTotalDuration(): number {
    let totalDuration: number = 0;
    this.albumInfo?.tracks.forEach((track) => {
      totalDuration += track.durationSeconds;
    });

    return Math.floor(totalDuration / 60);
  }

  playCurrentTrack(track: Track) {
    
    if (!this.playlistService.checkExistTrackInCurrentPlaylist(track)) {
      this.playlistService.addTrackToCurrentPlaylist(track);
      this.trackService.setCurrentTrack(track);
    } else {
      this.trackService.setCurrentTrack(track);
    }
    
  }

  // pauseAlbum(): void {
  //   this.audioService.pauseAudio();
  //   this.status = 'pause';
  // }

  // startToPlay(): void {
  //   if (this.status === 'start') {
  //     const newPlaylist = new Playlist();
  //     newPlaylist.playlistDetails = [];
  //     this.albumInfo.tracks.forEach((track, index) => {
  //       const playlistDetail = new PlaylistDetail();
  //       playlistDetail.track = track;
  //       newPlaylist.playlistDetails.push(playlistDetail);
  //     });
  //     this.playlistService.setCurrentPlaylist(newPlaylist, 0);
  //     this.audioService.playAudio();
  //     this.status = 'resume';
  //   } else {
  //     this.status = 'resume';
  //     this.audioService.playAudio();
  //   }
  // }

  addToCurrentPlaylist(): void {

    this.trackSelected.forEach((track) => {
      this.trackService.getTrack(track.id).subscribe((response: any) => { 
        if (!this.playlistService.checkExistTrackInCurrentPlaylist(response.data)) {
          this.playlistService.addTrackToCurrentPlaylist(response.data);
        }
      });
    })
    this.toastr.info('Thêm vào danh sách phát thành công');

    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');
    element.forEach((item) => item.classList.remove('is-selected'));
    inputCheckbox.forEach((item) => (item.checked = false));
    this.trackSelected = [];
  }

  addTrackToCurrentPlaylist(track: Track): void {
    if (!this.playlistService.checkExistTrackInCurrentPlaylist(track)) {
      this.playlistService.addTrackToCurrentPlaylist(track);
    }
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  playNextCurrentTrack(trackId: number): void {
    this.trackService.getTrack(trackId).subscribe((response: any) => {
      this.playlistService.playNextCurrentTrack(response.data);
    });
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  addAlbumToCurrentPlaylist(): void {
    this.albumInfo.tracks.forEach((track) => {
      this.trackService.getTrack(track.id).subscribe((response: any) => { 
        if (!this.playlistService.checkExistTrackInCurrentPlaylist(response.data)) {
          this.playlistService.addTrackToCurrentPlaylist(response.data);
        }
      });
    });
    this.chooseOptionAlbum = false;
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

  openChooseOption(): void {
    this.chooseOption = !this.chooseOption;
  }

  openChooseOptionAlbum(): void {
    this.chooseOptionAlbum = !this.chooseOptionAlbum;
  }

  openChooseOptionTrack(index): void {
    this.chooseOptionTrack[index] = !this.chooseOptionTrack[index];
  }

  openChooseOptionOtherTrack(): void {
    this.chooseOptionOtherTrack = !this.chooseOptionOtherTrack;
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

  selectedTrack(track: Track, item: any): void {
    if (item.className.includes('select-item')) {
      if (item.className.includes('is-selected')) {
        item.classList.remove('is-selected');
        this.trackSelected.splice(this.trackSelected.indexOf(track), 1);
      } else {
        this.trackSelected.push(track);
        item.classList.add('is-selected');
      }
    }
  }

  selectAllTrack(): void {
    this.selectAll = !this.selectAll;
    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');

    if (this.selectAll) {
      element.forEach((item) => item.classList.add('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = true));
      this.albumInfo.tracks.forEach((track) => this.trackSelected.push(track));
    } else {
      element.forEach((item) => item.classList.remove('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = false));
      this.trackSelected = [];
    }
  }
}
