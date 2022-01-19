import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from './../@model/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService{

  path: string = "/genre";

  constructor(private httpClient: HttpClient) {
  }

  listGenre(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>("https://61da80c9ce86530017e3cd75.mockapi.io/api/genre");
  }
}
