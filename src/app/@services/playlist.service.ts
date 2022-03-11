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
import { PlaylistDetailUpdate } from './../@model/playlist-detail-update.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends BaseService {

  path: string = '/playlist';

  currentPlaylist: Playlist;
  currentPlaylist$: BehaviorSubject<Playlist> = new BehaviorSubject<Playlist>(null);
  // initTrack = this.appUtilService.getFromLocalCache('initTrack');

  listPlaylist: BehaviorSubject<Playlist[]> = new BehaviorSubject<Playlist[]>(null);
  listPlaylist$: Observable<Playlist[]> = this.listPlaylist.asObservable();
  
  constructor(httpClient: HttpClient, private trackService: TrackService, private appUtilService: AppUtilService) { 
    super(httpClient); 
  }

  // write function to create init playlist
  createInitPlaylist(): Playlist {
    let initPlaylist = new Playlist();
    let initPlaylistDetail = new PlaylistDetail();
    // let initTrack = this.trackService.getInitTrack();
    let initTrack = new Track();
    let initSinger = new Artist();
    let initTrackUrl = "assets/tracks/sau-tat-ca-erik-1646978094155.mp3";
    initPlaylist.name = "Erik";
    initTrack.trackUrl = initTrackUrl;
    initTrack.id = 72;
    initTrack.name = 'Sau tất cả';
    initSinger.id = 0;
    initSinger.nickName = 'Erik';
    initTrack.singers = [];
    initTrack.singers[0] = initSinger;
    // console.log(initTrack);
    initPlaylist.playlistDetails = [];
    // this.trackService.getTrack(initTrack[0]?.id).subscribe((track) => {
      // initPlaylistDetail.track = track;
    // });
    initPlaylistDetail.track = initTrack;
    initPlaylist.playlistDetails[0] = initPlaylistDetail;
    

    return initPlaylist;
  }

  addTrackToCurrentPlaylist(track: Track) {
    let currentIndex;
    const playlistDetail = new PlaylistDetail();
    playlistDetail.track = track;
    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache() === null ? this.createInitPlaylist() : this.getCurrentPlaylistFromLocalCache();
    this.currentPlaylist.playlistDetails.push(playlistDetail);
    
    this.trackService.getCurrentTrack().subscribe((currentTrack) => {
      currentIndex = this.trackService.getIndexOfTrack(currentTrack, this.currentPlaylist);
    });

    this.setCurrentPlaylist(this.currentPlaylist, currentIndex);

  }

  setCurrentPlaylist(playlist: Playlist, currentIndex) {
    this.currentPlaylist$.next(playlist);
    this.trackService.setCurrentTrack(playlist?.playlistDetails[currentIndex]?.track);
    this.appUtilService.addToLocalCache('currentPlaylist', playlist);
  }

  getCurrentPlaylist() {
    this.getCurrentPlaylistFromLocalCache() === null ? this.setCurrentPlaylist(this.createInitPlaylist(), 0) : this.setCurrentPlaylist(this.getCurrentPlaylistFromLocalCache(), 0);
    return this.currentPlaylist$.asObservable();
  }

  getTrackFromCurrentIndex(playlist: Playlist, index) {
    return playlist?.playlistDetails[index]?.track;
  }

  getAllTrackFromCurrentPlaylist() {
    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache() === null ? this.createInitPlaylist() : this.getCurrentPlaylistFromLocalCache();
    return this.currentPlaylist?.playlistDetails;
  }

  removeTrackFromCurrentPlaylist(track: Track) {
    let currentIndex;
    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache();
    
    this.currentPlaylist.playlistDetails = this.currentPlaylist.playlistDetails.filter((playlistDetail) => playlistDetail.track.id !== track.id);
    this.trackService.getCurrentTrack().subscribe((currentTrack) => {
      currentIndex = this.trackService.getIndexOfTrack(currentTrack, this.currentPlaylist);
      if (currentTrack.name === track.name) {
        currentIndex = currentIndex === this.currentPlaylist.playlistDetails.length - 1 ? 0 : currentIndex + 1;
      }
    });
    this.setCurrentPlaylist(this.currentPlaylist, currentIndex);
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

  playNextCurrentTrack(track: Track) {

    
    let currentIndex, nextIndex;
    let playlistDetail = new PlaylistDetail();
    playlistDetail.track = track;

    if (this.checkExistTrackInCurrentPlaylist(track)) {
      this.removeTrackFromCurrentPlaylist(track);
    }  

    this.currentPlaylist = this.getCurrentPlaylistFromLocalCache();
    this.trackService.getCurrentTrack().subscribe((currentTrack) => {
      currentIndex = this.trackService.getIndexOfTrack(currentTrack, this.currentPlaylist);
      nextIndex = currentIndex === this.currentPlaylist.playlistDetails.length - 1 ? 0 : currentIndex + 1;  
    });
    if (this.currentPlaylist.playlistDetails.length === 1) {
      this.currentPlaylist.playlistDetails.push(playlistDetail);
    } else {
      this.currentPlaylist.playlistDetails.splice(nextIndex, 0, playlistDetail);
    } 
    this.setCurrentPlaylist(this.currentPlaylist, currentIndex);
  }

  getCurrentPlaylistFromLocalCache() {
    return this.appUtilService.getFromLocalCache('currentPlaylist');
  }

  createPlaylistFormData(playlist: any): FormData {
    const formData = new FormData();
    formData.append('name', playlist.name);
    formData.append('playlistTypeId', playlist.playlistTypeId.toString());
    formData.append('categoryId', playlist.categoryId.toString());
    formData.append('genreId', playlist.genreId.toString());
    formData.append('imgFile', playlist.imgFile);
    formData.append('description', playlist.description);

    return formData;
  }

  createPlaylist(formData: FormData): Observable<any> {
    return this.postRequest<any>(this.path, formData);
  }

  getPlaylistByUserId(pageNumber: number, pageSize: number): Observable<any> {
    return this.getRequest<any>(`${this.path}/my-playlist?page-number=${pageNumber}&page-size=${pageSize}`);
  }

  getPlaylistByPlaylistTypeId(playlistTypeId: number): Observable<any> {
    return this.getRequest<any>(`${this.path}/category?playlistTypeId=${playlistTypeId}`);
  }

  public getPlaylist(playlistId: number): Observable<Playlist> {
    return this.getRequest<Playlist>(`${this.path}/single/${playlistId}`);
  }

  public updateTrackToDetails(PlaylistDetailUpdate: any): Observable<PlaylistDetailUpdate> {
    return this.postRequest<PlaylistDetailUpdate>(`${this.path}/details`, PlaylistDetailUpdate);
  }

  public removePlaylist(playlistId: number): Observable<Playlist> {
    return this.deleteRequest<Playlist>(`${this.path}/${playlistId}`);
  }

  public createPlaylistDetailUpdateFormData(playlistDetail: PlaylistDetailUpdate) {
    const formData = new FormData();
    formData.append('playlistId', playlistDetail.playlistId.toString());
    formData.append('trackId', playlistDetail.trackId.toString());
    formData.append('isRemove', playlistDetail.isRemove.toString());
    return formData;
  }
}
