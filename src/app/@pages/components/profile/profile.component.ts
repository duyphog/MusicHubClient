import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { Playlist } from 'src/app/@model/playlist.model';
import { CommonService } from 'src/app/@services/common.service';
import { PlaylistService } from './../../../@services/playlist.service';

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

@Component({
  selector: 'add-new-playlist',
  templateUrl: '../my-song-list/add-new-playlist.html',
  styleUrls: ['../my-song-list/my-song-list.component.css'],
})
export class AddNewPlaylist implements OnInit{

  namePlaylist: string;
  genreIdPlaylist: number;
  categoryIdPlaylist: number;
  allowAdd: boolean = false;
  listGenre: Genre[] = [];
  listCategory: Category[] = [];

  constructor(
    public dialog: MatDialog,
    private playlistService: PlaylistService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.commonService.listGenre().subscribe((res: any) => {
      this.listGenre = res.data;
    });

    this.commonService.listCategory().subscribe((res: any) => {
      this.listCategory = res.data;
    });

  }

  closeAddNewPlaylist() {
    this.dialog.closeAll();
  }

  onChangeNamePlaylist(name: any) {
    this.namePlaylist = name;
    this.checkInformation();
  }

  onChangeCategoryPlaylist(category: any) {
    this.categoryIdPlaylist = category;
    this.checkInformation();
  }

  onChangeGenrePlaylist(genre: any) {
    this.genreIdPlaylist = genre;
    this.checkInformation();
  }

  onAddNewPlaylist() {
    let playlist: Playlist = new Playlist();
    playlist.name = this.namePlaylist;
    playlist.genre.id = this.genreIdPlaylist;
    playlist.category.id = this.categoryIdPlaylist;
    const formData = this.playlistService.createPlaylistFormData(playlist);
    this.playlistService.createPlaylist(formData).subscribe((res: any) => {
      this.toastr.success("Thêm playlist thành công");
    }, (error : any) => {
      this.toastr.error(error.error.errorMessage);
    });
    this.dialog.closeAll();

  }

  checkInformation(): void {
    if (this.namePlaylist !== "" && this.genreIdPlaylist !== undefined &&this.categoryIdPlaylist !== undefined) {
      this.allowAdd = true;
    } else {
      this.allowAdd = false;
    }
  }
}
