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

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private albumService: AlbumService, public appUtilService: AppUtilService, public trackService: TrackService, public playlistService: PlaylistService, private toastr: ToastrService, private audioService: AudioService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAlbumDetail();
    })
  }

  getAlbumDetail() {

    const hasAlbumId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasAlbumId) {

      const albumId = this.route.snapshot.paramMap.get('id');

      this.albumService.getAlbumDetail(+albumId).subscribe((res: any) => {
        this.albumInfo = res.data;
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

  playCurrentTrack(id) {
    this.trackService.getTrack(id).subscribe((res: any) => {
      if (!this.playlistService.checkExistTrackInCurrentPlaylist(res.data)) {
        this.playlistService.addTrackToCurrentPlaylist(res.data);
        this.trackService.setCurrentTrack(res.data);
        this.audioService.setAudio(res.data.trackUrl);
      } else {
        this.trackService.setCurrentTrack(res.data);
        this.audioService.setAudio(res.data.trackUrl);
      }
    });
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

    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');
    element.forEach((item) => item.classList.remove('is-selected'));
    inputCheckbox.forEach((item) => (item.checked = false));
    this.trackSelected = [];
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
