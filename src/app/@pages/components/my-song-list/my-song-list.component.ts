import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/@services/authentication.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { CommonService } from './../../../@services/common.service';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { Playlist } from './../../../@model/playlist.model';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AppUserService } from 'src/app/@services/app-user.service';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { PlaylistType } from './../../../@model/playlist-type.model';
import { AppUtilService } from 'src/app/@services/app-util.service';
import { Track } from './../../../@model/track.model';
import { TrackService } from 'src/app/@services/track.service';

@Component({
  selector: 'app-my-song-list',
  templateUrl: './my-song-list.component.html',
  styleUrls: ['./my-song-list.component.css'],
})
export class MySongListComponent implements OnInit {
  user: any;
  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionPlaylist: boolean = false;
  chooseOptionSong: boolean[] = [];
  chooseOptionAlbum: boolean = false;
  listPlaylist: Playlist[] = [];
  whiteListTrack: any[] = [];
  
  thePageNumber: number;
  thePageSize: number;
  theTotalElements: number;

  thePageNumberPlaylist: number;
  thePageSizePlaylist: number;
  theTotalElementsPlaylist: number;
  defaultImg = "assets/images/my-logo.png";

  trackSelected: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private playlistService: PlaylistService,
    private trackService: TrackService,
    private toastr: ToastrService,
    public appUserService: AppUserService,
    public appUtilService: AppUtilService
  ) {}

  ngOnInit(): void {
    this.thePageNumber = 1;
    this.thePageSize = 5;
    this.theTotalElements = 0;

    this.thePageNumberPlaylist = 1;
    this.thePageSizePlaylist = 9;
    this.theTotalElementsPlaylist = 0;

    this.user = this.authenticationService.getUserInfoFromLocalCache();
    this.listPlaylistByUser();
    this.playlistService.listPlaylist$.subscribe((res) => {
      this.listPlaylist = res;
    });
    this.listWhiteListTrack();
  }

  listPlaylistByUser(): void {
    this.playlistService
      .getPlaylistByUserId(this.thePageNumberPlaylist - 1, this.thePageSizePlaylist)
      .subscribe((res) => {
        this.playlistService.listPlaylist.next(res.data.content);
        // this.listPlaylist = res.data.content;
        this.thePageNumberPlaylist = res.data.pageInfo.currentPage + 1;
        this.thePageSizePlaylist = res.data.pageInfo.pageSize;
        this.theTotalElementsPlaylist = res.data.pageInfo.totalElements;
      });
  }

  listWhiteListTrack(): void {
    this.appUserService
      .getWhiteList(this.thePageNumber - 1, this.thePageSize)
      .subscribe((res) => {
        this.whiteListTrack = res.data.content;
        this.thePageNumber = res.data.pageInfo.currentPage + 1;
        this.thePageSize = res.data.pageInfo.pageSize;
        this.theTotalElements = res.data.pageInfo.totalElements;
      });
  }

  playCurrentTrack(id) {
    this.trackService.getTrack(id).subscribe((res: any) => {
      if (!this.playlistService.checkExistTrackInCurrentPlaylist(res.data)) {
        this.playlistService.addTrackToCurrentPlaylist(res.data);
        this.trackService.setCurrentTrack(res.data);
      } else {
        this.trackService.setCurrentTrack(res.data);
      }
    });
  }

  likedTrack(id: number) {
    if (this.appUserService.checkExistTrackInTrackLikedList(id)) {
      this.appUserService
        .updateWhiteList({ trackId: id, isAdd: false })
        .subscribe((response: any) => {
          this.appUserService.updateTrackLikedFromLocalCache({
            trackId: id,
            isAdd: false,
          });
          this.listWhiteListTrack();
          this.toastr.success('Đã xóa khỏi danh sách yêu thích');
        });
    } else {
      this.appUserService
        .updateWhiteList({ trackId: id, isAdd: true })
        .subscribe((response: any) => {
          this.appUserService.updateTrackLikedFromLocalCache({
            trackId: id,
            isAdd: true,
          });
          this.listWhiteListTrack();
          this.toastr.success('Đã thêm vào danh sách yêu thích');
        });
    }
  }

  playNextCurrentTrack(trackId: number): void {
    this.trackService.getTrack(trackId).subscribe((response: any) => {
      this.playlistService.playNextCurrentTrack(response.data);
    });
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  addTrackToCurrentPlaylist(track: Track): void {
    if (!this.playlistService.checkExistTrackInCurrentPlaylist(track)) {
      this.playlistService.addTrackToCurrentPlaylist(track);
    }
    this.toastr.info('Thêm vào danh sách phát thành công');
  }

  addToCurrentPlaylist(): void {

    this.trackSelected.forEach((track) => {
      this.trackService.getTrack(track.id).subscribe((response: any) => { 
        if (!this.playlistService.checkExistTrackInCurrentPlaylist(response.data)) {
          this.playlistService.addTrackToCurrentPlaylist(response.data);
        }
      });
    })
    this.toastr.info('Thêm vào danh sách phát thành công');

    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');
    element.forEach((item) => item.classList.remove('is-selected'));
    inputCheckbox.forEach((item) => (item.checked = false));
    this.trackSelected = [];
  }

  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

  openChooseOption(): void {
    this.chooseOption = !this.chooseOption;
  }

  openChooseOptionPlaylist(): void {
    this.chooseOptionPlaylist = !this.chooseOptionPlaylist;
  }

  openChooseOptionSong(index): void {
    this.chooseOptionSong[index] = !this.chooseOptionSong[index];
  }

  openChooseOptionAlbum(): void {
    this.chooseOptionAlbum = !this.chooseOptionAlbum;
  }

  selectedSong(item: any, index): void {
    if (item.className.includes('select-item')) {
      if (item.className.includes('is-selected')) {
        item.classList.remove('is-selected');
        this.trackSelected.splice(this.trackSelected.indexOf(item.id), 1);
      } else {
        this.trackSelected.push(item.id);
        item.classList.add('is-selected');
      }
    }
  }

  selectAllSong(): void {
    this.selectAll = !this.selectAll;
    var element = document.getElementsByName('select-song');
    var inputCheckbox: any = document.getElementsByName('checkbox-song');

    if (this.selectAll) {
      element.forEach((item) => item.classList.add('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = true));
      this.whiteListTrack.forEach((song) => this.trackSelected.push(song));
    } else {
      element.forEach((item) => item.classList.remove('is-selected'));
      inputCheckbox.forEach((item) => (item.checked = false));
      this.trackSelected = [];
    }
  }

  changePage(event: any) {
    this.thePageNumber = event;
    this.listWhiteListTrack();
  }

  changePagePlaylist(event: any) {
    this.thePageNumberPlaylist = event;
    this.listPlaylistByUser();
  }
}

@Component({
  selector: 'add-new-playlist',
  templateUrl: 'add-new-playlist.html',
  styleUrls: ['./my-song-list.component.css'],
})
export class AddNewPlaylist implements OnInit {
  allowAdd: boolean = false;
  user: any;
  listGenre: Genre[] = [];
  listCategory: Category[] = [];
  listPlaylistType: PlaylistType[] = [
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Sleep' },
    { id: 3, name: 'Gym' },
    { id: 4, name: 'Dance' },
    { id: 5, name: 'Work' },
    { id: 6, name: 'Coffee' },
    { id: 7, name: 'Game' },
    { id: 8, name: 'Travel' },
    { id: 9, name: 'New Year' },
  ];
  addNewPlaylistFormGroup: FormGroup;

  @ViewChild('listPlaylist') listPlaylist: Playlist[];

  constructor(
    public dialog: MatDialog,
    private playlistService: PlaylistService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.addNewPlaylistFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      categoryId: new FormControl(0, [Validators.required, Validators.min(1)]),
      genreId: new FormControl(0, [Validators.required, Validators.min(1)]),
      playlistTypeId: new FormControl(0, [
        Validators.required,
        Validators.min(1),
      ]),
      description: new FormControl('', []),
      imgFile: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.commonService.listGenre().subscribe((res: any) => {
      this.listGenre = res.data;
    });

    this.commonService.listCategory().subscribe((res: any) => {
      this.listCategory = res.data;
    });

    this.user = this.authenticationService.getUserInfoFromLocalCache();
  }

  closeAddNewPlaylist() {
    this.dialog.closeAll();
  }

  onAddNewPlaylist(playlistCreate: any) {
    const data = {
      name: playlistCreate.name,
      genreId: playlistCreate.genreId,
      categoryId: playlistCreate.categoryId,
      description: playlistCreate.description,
      playlistTypeId: playlistCreate.playlistTypeId,
      imgFile: playlistCreate.imgFile,
    };

    if (this.addNewPlaylistFormGroup.invalid) {
      this.addNewPlaylistFormGroup.markAllAsTouched();
    } else {
      const formData = this.playlistService.createPlaylistFormData(data);
      this.playlistService.createPlaylist(formData).subscribe(
        (response: any) => {
          this.toastr.success('Thêm playlist thành công');
        },
        (error: any) => {
          this.toastr.error(error.error.errorMessage);
        }
      );
      this.dialog.closeAll();
    }
  }

  get name(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('name');
  }

  get categoryIdPlaylist(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('categoryId');
  }

  get genreIdPlaylist(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('genreId');
  }

  get playlistTypeId(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('playlistTypeId');
  }
}
