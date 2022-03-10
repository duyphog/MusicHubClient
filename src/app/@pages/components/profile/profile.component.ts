import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { Playlist } from 'src/app/@model/playlist.model';
import { CommonService } from 'src/app/@services/common.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { FormGroup } from '@angular/forms';
import { AddNewPlaylist } from '../my-song-list/my-song-list.component';
import { Artist } from './../../../@model/artist.model';
import { AppUserService } from 'src/app/@services/app-user.service';
import { AppUtilService } from 'src/app/@services/app-util.service';
import { SingerService } from './../../../@services/singer.service';
import { Track } from './../../../@model/track.model';
import { ActivatedRoute } from '@angular/router';
import { Album } from './../../../@model/album.model';
import { TrackService } from 'src/app/@services/track.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionPlaylist: boolean = false;
  chooseOptionSong: boolean[] = [];
  chooseOptionAlbum: boolean = false;
  singerInfo: Artist;
  trackList: Track[];
  albumList: Album[];

  thePageNumber: number;
  thePageSize: number;
  theTotalElements: number;

  thePageNumberTrack: number;
  thePageSizeTrack: number;
  theTotalElementsTrack: number;

  songList: any[] = [
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
  ];

  defaultImage = "assets/images/my-logo.png";
  songSelected: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public appUserService: AppUserService,
    public appUtilService: AppUtilService,
    private singerService: SingerService,
    private trackService: TrackService,
    private playlistService: PlaylistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.thePageNumber = 1;
    this.thePageSize = 1;
    this.theTotalElements = 0;

    this.thePageNumberTrack = 1;
    this.thePageSizeTrack = 5;
    this.theTotalElementsTrack = 0;

    this.route.paramMap.subscribe(() => {
      this.getSingerInfo();
      this.listAlbum();
      this.listTrack();
    })
    
  }

  getSingerInfo(): void {

    const hasSingerId = this.route.snapshot.paramMap.has('id');

    if (hasSingerId) {
      const singerId = +this.route.snapshot.paramMap.get('id');

      this.singerService.getSinger(singerId).subscribe((response: any) => {
        this.singerInfo = response.data;
      });

    }
  }

  addTrackToCurrentPlaylist(track: Track): void {
    if (!this.playlistService.checkExistTrackInCurrentPlaylist(track)) {
      this.playlistService.addTrackToCurrentPlaylist(track);
    }
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  listTrack() {

    const hasSingerId = this.route.snapshot.paramMap.has('id');

    if (hasSingerId) {

      const singerId = +this.route.snapshot.paramMap.get('id');

      this.singerService.getTracksBySinger(singerId, this.thePageNumberTrack - 1, this.thePageSizeTrack).subscribe((response: any) => {
        this.trackList = response.data.content === null ? [] : response.data.content;
        this.thePageNumberTrack = response.data.pageInfo.currentPage + 1;
        this.thePageSizeTrack = response.data.pageInfo.pageSize;
        this.theTotalElementsTrack = response.data.pageInfo.totalElements;
      });
    }
  }

  listAlbum() {

    const hasSingerId = this.route.snapshot.paramMap.has('id');

    if (hasSingerId) {

      const singerId = +this.route.snapshot.paramMap.get('id');
     
      this.singerService.getAlbumsBySinger(singerId, this.thePageNumber - 1, this.thePageSize).subscribe((response: any) => {
        this.albumList = response.data.content === null ? [] : response.data.content;
        this.thePageNumber = response.data.pageInfo.currentPage + 1;
        this.thePageSize = response.data.pageInfo.pageSize;
        this.theTotalElements = response.data.pageInfo.totalElements;
      });

    }
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

  openChooseOptionSong(index): void {
    this.chooseOptionSong[index] = !this.chooseOptionSong[index];
  }

  openChooseOptionAlbum(): void {
    this.chooseOptionAlbum = !this.chooseOptionAlbum;
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

  playNextCurrentTrack(trackId: number): void {
    this.trackService.getTrack(trackId).subscribe((response: any) => {
      this.playlistService.playNextCurrentTrack(response.data);
    });
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  changePageAlbum(event: any) {
    this.thePageNumber = event;
    this.listAlbum();
  }

  changePageTrack(event: any) {
    this.thePageNumberTrack = event;
    this.listTrack();
  }

}

