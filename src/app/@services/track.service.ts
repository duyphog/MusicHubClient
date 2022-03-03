import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from './../@model/track';
import { BaseService } from 'src/app/@services/base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genre } from '../@model/genre';
import { Artist } from '../@model/artist';
import { Album } from '../@model/album';

@Injectable({
  providedIn: 'root',
})
export class TrackService extends BaseService{
  
  public currentTrackPlaying: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);
  path: string = '/track';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  setCurrentTrack(track: Track) {
    this.currentTrackPlaying.next(track);
  }

  getCurrentTrack(): Observable<Track> {
    return this.currentTrackPlaying.asObservable();
  }

  public createTrackFormData(track: Track, genres: Genre[], singers: Artist[], composers: Artist[], album: Album, trackFile: File) {
    const formData = new FormData();
    
    singers.filter(singer => { 
      formData.append("singerIds", singer?.id.toString());
    });
    genres.forEach(genre => {
      formData.append("genreIds", genre?.id.toString());
    });
    composers.forEach(composer => {
      formData.append("composerIds", composer?.id.toString());
    });
    formData.append("albumId", album?.id.toString());
    formData.append("categoryId", track?.category.id.toString());
    formData.append("name", track?.name);
    formData.append("trackFile", trackFile);
    formData.append("musicProduction", track?.musicProduction);
    formData.append("musicYear", track?.musicYear.toString());
    formData.append("lyric", track?.lyric);
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
}
