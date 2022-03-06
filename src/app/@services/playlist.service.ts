import { Injectable, OnInit } from '@angular/core';
import { BaseService } from 'src/app/@services/base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Playlist } from './../@model/playlist.model';
import { TrackService } from 'src/app/@services/track.service';
import { AppUtilService } from 'src/app/@services/app-util.service';
import { Track } from 'src/app/@model/track.model';
import { PlaylistDetail } from '../@model/playlist-detail.model';
import { Artist } from '../@model/artist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends BaseService {

  path: string = '/playlist';

  currentPlaylist: Playlist;
  currentPlaylist$: BehaviorSubject<Playlist> = new BehaviorSubject<Playlist>(null);
  
  constructor(httpClient: HttpClient, private trackService: TrackService, private appUtilService: AppUtilService) { 
    super(httpClient); 
  }

  // write function to create init playlist
  createInitPlaylist(): Playlist {
    let initPlaylist = new Playlist();
    let initPlaylistDetail = new PlaylistDetail();
    let initTrack = new Track();
    let initSinger = new Artist();
    let initTrackUrl = "assets/tracks/sau-tat-ca-1646387817726.mp3";
    initPlaylist.name = "My Playlist";
    initPlaylist.playlistDetails = [];
    initTrack.trackUrl = initTrackUrl;
    initTrack.id = 0;
    initTrack.name = 'Sau tất cả';
    initSinger.id = 0;
    initSinger.nickName = 'singer';
    initTrack.singers = [];
    initTrack.singers[0] = initSinger;
    initPlaylistDetail.track = initTrack;
    initPlaylist.playlistDetails[0] = initPlaylistDetail;

    return initPlaylist;
  }

  addTrackToCurrentPlaylist(track: Track) {
    
    const playlistDetail = new PlaylistDetail();
    playlistDetail.track = track;
    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache() === null ? this.createInitPlaylist() : this.getCurrentPlaylistFromLocalCache();
    this.currentPlaylist.playlistDetails.push(playlistDetail);
    this.setCurrentPlaylist(this.currentPlaylist);

  }

  setCurrentPlaylist(playlist: Playlist) {
    this.currentPlaylist$.next(playlist);
    this.trackService.setCurrentTrack(playlist?.playlistDetails[0].track);
    this.appUtilService.addToLocalCache('currentPlaylist', playlist);
  }

  getCurrentPlaylist() {
    this.getCurrentPlaylistFromLocalCache() === null ? this.setCurrentPlaylist(this.createInitPlaylist()) : this.setCurrentPlaylist(this.getCurrentPlaylistFromLocalCache());
    return this.currentPlaylist$.asObservable();
  }

  getTrackFromCurrentIndex(playlist: Playlist, index) {
    return playlist?.playlistDetails[index]?.track;
  }

  getAllTrackFromCurrentPlaylist() {
    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache() === null ? this.createInitPlaylist() : this.getCurrentPlaylistFromLocalCache();
    return this.currentPlaylist?.playlistDetails;
  }

  checkExistTrackInCurrentPlaylist(track: Track) {
    let isExist = false;
    this.getAllTrackFromCurrentPlaylist().forEach((playlistDetail) => {
      if (playlistDetail.track.name === track.name) {
        isExist = true;
      }
    });
    return isExist;
  }

  getCurrentPlaylistFromLocalCache() {
    return this.appUtilService.getFromLocalCache('currentPlaylist');
  }

  createPlaylistFormData(playlist: any): FormData {
    const formData = new FormData();
    formData.append('name', playlist.name);
    formData.append('playlistTypeId', Number(1).toString());
    formData.append('categoryId', playlist.categoryId.toString());
    formData.append('genreId', playlist.genreId.toString());
    formData.append('imgFile', playlist.imgFile);
    formData.append('description', playlist.description);

    return formData;
  }

  createPlaylist(formData: FormData): Observable<any> {
    return this.postRequest<any>(this.path, formData);
  }

}
