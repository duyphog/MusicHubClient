import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../@model/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService{

  path: string = "/artist";

  constructor(private httpClient: HttpClient) {
  }

  listArtist(): Observable<Artist[]> {
    return this.httpClient.get<Artist[]>("https://61da80c9ce86530017e3cd75.mockapi.io/api/artist");
  }
}
