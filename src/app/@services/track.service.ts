import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from './../@model/track';
import { BaseService } from 'src/app/@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackService extends BaseService{
  path: string = '/track';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createTrackFormData(artistId: number, track: Track) {
    const formData = new FormData();
    formData.append("artistId", artistId.toString());
    formData.append("albumId", null);
    formData.append("name", track.name);
    formData.append("lyric", track.lyric);
    formData.append("imageUrl", track.imageUrl);
    formData.append("fileUrl", track.fileUrl);
  }

  public uploadTrackFile(
    formData: FormData
  ): Observable<HttpEvent<any>> {
    return this.postRequest<any>(`${this.path}/upload-track-file`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
