import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../@model/category.model';
import { Artist } from '../@model/artist.model';
import { Genre } from '../@model/genre.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseService {


  public currentCategory: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentGenre: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentPlaylistType: BehaviorSubject<string> = new BehaviorSubject<string>('');

  path: string = '/common';

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  setCurrentCategory(name: string) {
    this.currentCategory.next(name);
  }

  setCurrentGenre(name: string) {
    this.currentGenre.next(name);
  }

  setCurrentPlaylistType(name: string) {
    this.currentPlaylistType.next(name);
  }

  getCurrentCategory(): Observable<string> {
    return this.currentCategory.asObservable();
  }

  getCurrentGenre(): Observable<string> {
    return this.currentGenre.asObservable();
  }

  getCurrentPlaylistType(): Observable<string> {
    return this.currentPlaylistType.asObservable();
  }

  listCategory(): Observable<Category[]> {
    return this.getRequest<Category[]>(`${this.path}/category`);
  }

  listGenre(): Observable<Genre[]> {
    return this.getRequest<Genre[]>(`${this.path}/genre`);
  }

  listSinger(name: string): Observable<any> {
    return this.getRequest<any>(`${this.path}/search-singer?search=${name}`);
  }

  listComposer(name: string): Observable<any> {
    return this.getRequest<any>(`${this.path}/search-composer?search=${name}`);
  }
}
