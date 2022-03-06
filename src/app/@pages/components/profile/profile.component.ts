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
  songSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
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

  selectedSong(item: any, index): void {
    if (item.className.includes('select-item')) {
      if (item.className.includes('is-selected')) {
        item.classList.remove('is-selected');
        this.songSelected.splice(this.songSelected.indexOf(item.id), 1);
      } else {
        this.songSelected.push(item.id);
        item.classList.add('is-selected');
      }
    }
  }

  selectAllSong(): void {
    this.selectAll = !this.selectAll;
    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');

    if (this.selectAll) {
      element.forEach((item) => item.classList.add('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = true));
      this.songList.forEach((song) => this.songSelected.push(song.id));
    } else {
      element.forEach((item) => item.classList.remove('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = false));
      this.songSelected = [];
    }
  }
}

