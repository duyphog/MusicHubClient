import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Album } from 'src/app/@model/album.model';
import { AlbumService } from 'src/app/@services/album.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@services/common.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Track } from '../../../@model/track.model';
import { TrackService } from 'src/app/@services/track.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppUtilService } from '../../../@services/app-util.service';

@Component({
  selector: 'app-track-and-album-list',
  templateUrl: './track-and-album-list.component.html',
  styleUrls: [
    './track-and-album-list.component.css',
  ],
})
export class TrackAndAlbumComponent implements OnInit, OnDestroy {
  
  private subscriptions: Subscription[] = [];
  defaultImage: string = 'assets/images/default-image.png';

  albums: Album[] = [];
  thePageNumber: number;
  thePageSize: number;
  theTotalElements: number;

  tracks: Track[] = [];
  thePageNumberTrack: number;
  thePageSizeTrack: number;
  theTotalElementsTrack: number;

  currentCategoryId: number;
  previousCategoryId: number;
  currentCategoryName: string;

  currentGenreId: number;
  previousGenreId: number;
  currentGenreName: string;

  chooseOptionTrack: boolean[] = [];

  constructor(
    private albumService: AlbumService,
    public trackService: TrackService,
    public appUtilService: AppUtilService,
    private route: ActivatedRoute,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    // this.thePageNumber = 1;
    this.thePageSize = 1;
    this.theTotalElements = 0;

    this.thePageNumberTrack = 1;
    this.thePageSizeTrack = 5;
    this.theTotalElementsTrack = 0;

    this.route.paramMap.subscribe(() => {
      this.listAlbum();
      this.listTrack();
    });

    this.commonService.getCurrentCategory().subscribe((response: any) => {
      this.currentCategoryName = response;
    });

    this.commonService.getCurrentGenre().subscribe((response: any) => {
      this.currentGenreName = response;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openChooseOptionTrack(index): void {
    this.chooseOptionTrack[index] = !this.chooseOptionTrack[index];
  }

  listAlbum() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('category-id');
    const hasGenreId: boolean = this.route.snapshot.paramMap.has('genre-id');

    if (hasCategoryId && hasGenreId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('category-id');
      this.currentGenreId = +this.route.snapshot.paramMap.get('genre-id');

      if (
        this.currentCategoryId !== this.previousCategoryId ||
        this.currentGenreId !== this.previousGenreId
      ) {
        this.albums = [];
        this.theTotalElements = 0;
        this.thePageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;
      this.previousGenreId = this.currentGenreId;

      this.albumService
        .listAlbumByCategoryAndGenre(
          this.currentCategoryId,
          this.currentGenreId,
          this.thePageNumber - 1,
          this.thePageSize
        )
        .subscribe((response: any) => {
          this.albums = response.data.content;
          this.thePageNumber = response.data.pageInfo.currentPage + 1;
          this.thePageSize = response.data.pageInfo.pageSize;
          this.theTotalElements = response.data.pageInfo.totalElements;
        });
    }
  }

  listTrack() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('category-id');
    const hasGenreId: boolean = this.route.snapshot.paramMap.has('genre-id');

    if (hasCategoryId && hasGenreId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('category-id');
      this.currentGenreId = +this.route.snapshot.paramMap.get('genre-id');

      if (
        this.currentCategoryId !== this.previousCategoryId ||
        this.currentGenreId !== this.previousGenreId
      ) {
        this.tracks = [];
        this.theTotalElementsTrack = 0;
        this.thePageNumberTrack = 1;
      }

      this.previousCategoryId = this.currentCategoryId;
      this.previousGenreId = this.currentGenreId;

      this.trackService
        .listTrackByCategoryAndGenre(
          this.currentCategoryId,
          this.currentGenreId,
          this.thePageNumberTrack - 1,
          this.thePageSizeTrack
        )
        .subscribe((response: any) => {
          // console.log(response.data.content);
          this.tracks = response.data.content === null ? [] : response.data.content;
          this.thePageNumberTrack = response.data.pageInfo.currentPage + 1;
          this.thePageSizeTrack = response.data.pageInfo.pageSize;
          this.theTotalElementsTrack = response.data.pageInfo.totalElements;
        });
    }
  }

  changePageAlbum(event: any) {
    this.thePageNumber = event;
    this.listAlbum();
  }

  changePageTrack(event: any) {
    this.thePageNumberTrack = event;
    this.listTrack();
  }
}
