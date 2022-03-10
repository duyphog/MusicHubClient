import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from '../@model/track.model';
import { BaseService } from 'src/app/@services/base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genre } from '../@model/genre.model';
import { Artist } from '../@model/artist.model';
import { Album } from '../@model/album.model';
import { AppUtilService } from './app-util.service';
import { Playlist } from '../@model/playlist.model';

@Injectable({
  providedIn: 'root',
})
export class TrackService extends BaseService{
  
  public currentTrackPlaying: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);
  path: string = '/track';

  constructor(httpClient: HttpClient, private appUtilService: AppUtilService) {
    super(httpClient);
  }

  setCurrentTrack(track: Track) {
    this.currentTrackPlaying.next(track);
    this.appUtilService.addToLocalCache('currentTrack', track);
  }

  getCurrentTrack(): Observable<Track> {
    return this.currentTrackPlaying.asObservable();
  }

  getIndexOfTrack(track: Track, playlist: Playlist) {
    return playlist?.playlistDetails.findIndex(playlistDetail => playlistDetail.track?.id === track?.id);
  } 

  getRecommendedTracks(): Observable<Track[]> {
    return this.getRequest<Track[]>(`${this.path}/search?category-id=6&genre-id=0&page-number=0&page-size=5`);
  }

  public createTrackFormData(track: Track, genres: Genre[], singers: Artist[], composers: Artist[], album: Album, trackFile: File) {
    const formData = new FormData();
    
    singers.forEach(singer => { 
      formData.append("singerIds", singer?.id.toString());
    });
    if (composers.length !== 0) {
      composers.forEach(composer => {
        formData.append("composerIds", composer?.id.toString());
      });
    } 

    if (genres.length !== 0) {
      genres.forEach(genre => {
        formData.append("genreIds", genre?.id.toString());
      });
    } 
      
    if (album !== undefined)
      formData.append("albumId", album?.id.toString());
    
    if (track?.category !== undefined && track?.category.id !== null)
      formData.append("categoryId", track?.category.id.toString());
    formData.append("name", track?.name);
    formData.append("trackFile", trackFile);
    if (track?.musicProduction !== undefined)
      formData.append("musicProduction", track?.musicProduction);
    if (track?.musicYear !== null && track?.musicYear !== undefined)
      formData.append("musicYear", track?.musicYear.toString());
    if (track?.lyric !== undefined)
      formData.append("lyric", track?.lyric);
    if (track?.description !== undefined)
      formData.append("description", track?.description);
    return formData;
  }

  public addTrack(
    formData: FormData
  ): Observable<HttpEvent<any>> {
    return this.postRequest<any>(`${this.path}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  listTrackByCategoryAndGenre(categoryId: number, genreId: number, thePageNumber: number, thePageSize: number): Observable<Track[]> {
    return this.getRequest<Track[]>(`${this.path}/search?category-id=${categoryId}&genre-id=${genreId}&page-number=${thePageNumber}&page-size=${thePageSize}`);
  }

  getTrack(id: number): Observable<Track> {
    return this.getRequest<Track>(`${this.path}/single/${id}`);
  }

  listenedTrack(id: number): Observable<Track> {
    return this.getRequest<Track>(`${this.path}/listened/${id}`);
  }

  searchText(text: string, pageIndex: number): Observable<Track[]> {
    return this.getRequest<Track[]>(`${this.path}/search-text?text=${text}&pageIndex=${pageIndex}`);
  }
}
