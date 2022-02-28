import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../@model/album';
import { Artist } from '../@model/artist';
import { Genre } from '../@model/genre';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService extends BaseService {

  path: string = "/album";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  listAlbum(): Observable<Album[]> {
    return this.getRequest<Album[]>(`${this.path}`);
  }

  public createAlbumFormData(album: Album, genres: Genre[], singers: Artist[], imgFile: File, trackFiles: File[]) {
    const formData = new FormData();
    
    singers.filter(singer => { 
      formData.append("singerIds", singer?.id.toString());
    });
    genres.forEach(genre => {
      formData.append("genreIds", genre?.id.toString());
    });
    trackFiles.forEach((trackFile: any) => {
      formData.append("trackFiles", trackFile.item);
    });
    formData.append("categoryId", album?.category?.id.toString());
    formData.append("name", album?.name);
    formData.append("imgFile", imgFile);
    formData.append("musicProduction", album?.musicProduction);
    formData.append("musicYear", album?.musicYear?.toString());
    return formData;
  }

  public addAlbum(
    formData: FormData
  ): Observable<HttpEvent<any>> {
    return this.postRequest<any>(`${this.path}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
