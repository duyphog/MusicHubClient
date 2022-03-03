import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/@model/album';
import { Track } from 'src/app/@model/track';
import { AlbumService } from './../../../@services/album.service';
import { AppUtilService } from './../../../@services/app-util.service';
import { TrackService } from './../../../@services/track.service';

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

  trackSelected: any[] = [];

  albumInfo: Album;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private albumService: AlbumService, public appUtilService: AppUtilService, public trackService: TrackService) {}

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
      this.trackService.setCurrentTrack(res.data);
    });
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

  selectedTrack(item: any, index): void {
    if (item.className.includes('select-item')) {
      if (item.className.includes('is-selected')) {
        item.classList.remove('is-selected');
        this.trackSelected.splice(this.trackSelected.indexOf(item.id), 1);
      } else {
        this.trackSelected.push(item.id);
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
      this.albumInfo.tracks.forEach((song) => this.trackSelected.push(song.id));
    } else {
      element.forEach((item) => item.classList.remove('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = false));
      this.trackSelected = [];
    }
  }
}

@Component({
  selector: 'add-new-playlist',
  templateUrl: '../my-song-list/add-new-playlist.html',
  styleUrls: ['../my-song-list/my-song-list.component.css'],
})
export class AddNewPlaylist {
  publicMode: boolean = true;
  namePlaylist: string = null;

  constructor(public dialog: MatDialog) {}

  closeAddNewPlaylist() {
    this.dialog.closeAll();
  }

  onChangePublicMode() {
    this.publicMode = !this.publicMode;
  }

  onChangeNamePlaylist(name: any) {
    this.namePlaylist = name;
  }
}
