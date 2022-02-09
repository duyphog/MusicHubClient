import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionAlbum: boolean = false;
  chooseOptionSong: boolean = false;
  chooseOptionOtherSong: boolean = false;

  songList: any[] = [
    {
      srcImg: "https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg",
      name: "Ai Ai Ai",
      artist: "La Thăng New"
    },
    {
      srcImg: "https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg",
      name: "Ai Ai Ai",
      artist: "La Thăng New"
    }
  ];
  songSelected: any[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
  
  openChooseOptionSong(): void {
    this.chooseOptionSong = !this.chooseOptionSong;
  }

  openChooseOptionOtherSong(): void {
    this.chooseOptionOtherSong = !this.chooseOptionOtherSong;
  }

  selectedSong(item: any, index): void {

    if (item.className.includes("select-item")) {
      if (item.className.includes("is-selected")){
        item.classList.remove("is-selected");
        this.songSelected.splice(this.songSelected.indexOf(item.id), 1);
      } else {
        this.songSelected.push(item.id);
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
      this.songList.forEach(song => this.songSelected.push(song.id));
    } else {
      element.forEach(item => item.classList.remove("is-selected"));
      inputCheckbox.forEach(item => item.checked = false);
      this.songSelected = [];
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

  constructor(
    public dialog: MatDialog
  ) {}

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
