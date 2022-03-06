import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Playlist } from 'src/app/@model/playlist.model';
import { Track } from 'src/app/@model/track.model';
import { TrackService } from 'src/app/@services/track.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { PlaylistDetail } from './../../../@model/playlist-detail.model';
import { AddNewPlaylist } from '../my-song-list/my-song-list.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  chooseOptionSong: boolean[] = [];

  currentPlaylist: Playlist;
  listIndexGreaterThanCurrentIndex: number[] = [];
  listIndexSmallerThanCurrentIndex: number[] = [];
  currentListIndex: number[] = [];
  currentTrack: Track;

  currentIndex: number;

  constructor(public dialog: MatDialog, private trackService: TrackService, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.playlistService.getCurrentPlaylist().subscribe((playlist) => {
      
      this.trackService.getCurrentTrack().subscribe((track) => {
        this.currentTrack = track;
        this.currentPlaylist = new Playlist();
        this.currentIndex = this.trackService.getIndexOfTrack(track, playlist);
        this.listIndexGreaterThanCurrentIndex = [];
        this.listIndexSmallerThanCurrentIndex = [];
        this.splitPlaylist(playlist, this.currentIndex);
        this.onChangeIndexPlaylist(playlist);
      });

    });
  }

  ngAfterViewInit() {
    
  }

  imageTrack(track: Track): string {
    return track?.album === undefined ? '/assets/images/default-image.png' : track.album.imgUrl;
  }


  openChooseOptionSong(index): void {
    this.chooseOptionSong[index] = !this.chooseOptionSong[index];
  }

  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

  splitPlaylist(playlist: Playlist, currentIndex): void {
    playlist.playlistDetails.filter(playlistDetail => {
      if (this.trackService.getIndexOfTrack(playlistDetail.track, playlist) > currentIndex) {
        this.listIndexGreaterThanCurrentIndex.push(this.trackService.getIndexOfTrack(playlistDetail.track, playlist))
      } else if (this.trackService.getIndexOfTrack(playlistDetail.track, playlist) < currentIndex)  {
        this.listIndexSmallerThanCurrentIndex.push(this.trackService.getIndexOfTrack(playlistDetail.track, playlist))
      }
    });
    this.currentListIndex = this.listIndexGreaterThanCurrentIndex;
    this.listIndexSmallerThanCurrentIndex.forEach(index => {
      this.currentListIndex.push(index);
    });
  }

  onChangeIndexPlaylist(playlist: Playlist) {
    let countIndex = 0;
    playlist.playlistDetails.filter(playlistDetail => {
      if (this.trackService.getIndexOfTrack(playlistDetail.track, playlist) === this.currentListIndex[countIndex]) {
        this.currentPlaylist.playlistDetails.push(playlistDetail);
        countIndex++;
      }
    });
  }

}
