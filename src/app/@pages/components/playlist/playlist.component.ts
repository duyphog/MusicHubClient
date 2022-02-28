import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewPlaylist } from '../profile/profile.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  chooseOptionSong: boolean[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openChooseOptionSong(index): void {
    this.chooseOptionSong[index] = !this.chooseOptionSong[index];
  }

  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

}
