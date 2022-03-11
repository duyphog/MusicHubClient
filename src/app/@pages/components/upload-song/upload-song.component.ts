import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { Artist } from '../../../@model/artist.model';
import { GenreService } from './../../../@services/genre.service';
import { Genre } from '../../../@model/genre.model';
import { Track } from '../../../@model/track.model';
import { DragDropService } from '../../../@services/drag-drop.service';
import { ToastrService } from 'ngx-toastr';
import { TrackService } from './../../../@services/track.service';
import { AppUtilService } from './../../../@services/app-util.service';
import { Album } from 'src/app/@model/album.model';
import { AlbumService } from 'src/app/@services/album.service';
import { Category } from 'src/app/@model/category.model';
import { CommonService } from 'src/app/@services/common.service';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css'],
})
export class UploadSongComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  songFile: File;
  imageFile: File;
  songFileArr = [];
  songImageArr = [];
  fileObj = [];
  showLoading: boolean = false;

  albumSongFile: File[];
  albumImageFile: File;
  uploadSongFormGroup: FormGroup;
  uploadAlbumFormGroup: FormGroup;

  trackUpload: Track = new Track();
  albumUpload: Album = new Album();
  progress: number;
  refreshing: boolean;

  // category
  listCategory: Category[];

  // singer
  visibleSinger = true;
  selectableSinger = true;
  removableSinger = true;
  addOnBlurSinger = false;
  separatorKeysCodesSinger: number[] = [ENTER, COMMA];
  singerCtrl = new FormControl();
  singers: Artist[] = [];
  filteredSingers: Observable<Artist[]>;
  listSinger: Artist[] = [];
  initArtist = {
    id: Math.random(),
    nickName: 'Gõ nghệ danh',
    avatarImgUrl: '',
    birthday: new Date(),
    coverImgUrl: '',
    gender: true,
    isActive: true,
    isComposer: false,
    isSinger: false,
  };

  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('singerInput') singerInput: ElementRef;

  // genre
  visibleGenre = true;
  selectableGenre = true;
  removableGenre = true;
  addOnBlurGenre = false;
  separatorKeysCodesGenre: number[] = [ENTER, COMMA];
  genreCtrl = new FormControl();
  genres: Genre[] = [];
  filteredGenres: Observable<Genre[]>;
  listGenre: Genre[];

  @ViewChild('genreInput') genreInput: ElementRef;

  // album
  visibleAlbum = true;
  selectableAlbum = true;
  removableAlbum = true;
  addOnBlurAlbum = false;
  separatorKeysCodesAlbum: number[] = [ENTER, COMMA];
  albumCtrl = new FormControl();
  albums: Album[] = [];
  filteredAlbums: Observable<Album[]>;
  listAlbum: Album[];

  @ViewChild('albumInput') albumInput: ElementRef;

  // composer
  visibleComposer = true;
  selectableComposer = true;
  removableComposer = true;
  addOnBlurComposer = false;
  separatorKeysCodesComposer: number[] = [ENTER, COMMA];
  composerCtrl = new FormControl();
  composers: Artist[] = [];
  filteredComposers: Observable<Artist[]>;
  listComposer: Artist[] = [];

  @ViewChild('composerInput') composerInput: ElementRef;

  constructor(
    private genreService: GenreService,
    private albumService: AlbumService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private appUtilService: AppUtilService,
    private trackService: TrackService,
    public dragDropService: DragDropService,
    private formBuilder: FormBuilder
  ) {
    this.uploadSongFormGroup = this.formBuilder.group({
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      'singersFormControl': new FormControl('', [
        
      ]),
      'composersFormControl': new FormControl('', [

      ]),
      'genresFormControl': new FormControl('', [

      ]),
      'category': new FormControl('', [
        Validators.required,
      ]),
      
    });

    this.uploadAlbumFormGroup = this.formBuilder.group({
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      'singersFormControl': new FormControl('', [
        
      ]),
      'composersFormControl': new FormControl('', [

      ]),
      'genresFormControl': new FormControl('', [

      ]),
      'category': new FormControl('', [
        Validators.required,
      ]),
      'musicProduction': new FormControl('', [
        Validators.required,
      ]),
      'musicYear': new FormControl('', [
        Validators.required,
      ]),
    });
  }

  // Singer
  addSinger(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;
    // if ((value || '').trim()) {
    //   this.singers.push({
    //     id: Math.random(),
    //     name: value.trim(),
    //     description: '',
    //     number_of_track: 0,
    //     number_of_follower: 0,
    //   });
    // }
    // if (input) {
    //   input.value = '';
    // }
    // this.singerCtrl.setValue(null);
  }

  removeSinger(idx): void {
    this.singers.splice(idx, 1);
  }

  selectedSinger(event: MatAutocompleteSelectedEvent): void {
    this.singers.push(event.option.value);
    this.singerInput.nativeElement.value = '';
    this.singerCtrl.setValue(null);
  }

  // private _filterSinger(value: any): any[] {
  //   return this.listSinger.filter((singer) =>
  //     singer.nickName.toLowerCase().includes(value?.nickName === undefined ? value : value.nickName.toLowerCase())
  //   );
  // }

  // Genre
  addGenre(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.genres.push({
        id: Math.random(),
        name: value.trim(),
        description: '',
      });
    }

    if (input) {
      input.value = '';
    }

    this.genreCtrl.setValue(null);
  }

  removeGenre(idx): void {
    this.genres.splice(idx, 1);
  }

  selectedGenre(event: MatAutocompleteSelectedEvent): void {
    this.genres.push(event.option.value);
    this.genreInput.nativeElement.value = '';
    this.genreCtrl.setValue(null);
  }

  private _filterGenre(value: any): any[] {
    return this.listGenre.filter((genre) =>
      genre.name.toLowerCase().includes(value?.name === undefined ? value.toLowerCase() : value.name.toLowerCase())
    );
  }

  // Album
  addAlbum(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;
    // if ((value || '').trim()) {
    //   this.albums.push({
    //     id: Math.random(),
    //     name: value.trim(),
    //     releaseDate: new Date(),
    //     imageUrl: '',
    //     userId: null,
    //     artistId: null,
    //   });
    // }
    // if (input) {
    //   input.value = '';
    // }
    // this.albumCtrl.setValue(null);
  }

  removeAlbum(idx): void {
    this.albums.splice(idx, 1);
  }

  selectedAlbum(event: MatAutocompleteSelectedEvent): void {
    this.albums.push(event.option.value);
    this.albumInput.nativeElement.value = '';
    this.albumCtrl.setValue(null);
  }

  private _filterAlbum(value: any): any[] {
    return this.listAlbum.filter((album) =>
      album.name
        .toLowerCase()
        .includes(
          value?.name === undefined
            ? value.toLowerCase()
            : value.name.toLowerCase()
        )
    );
  }

  // Composer
  addComposer(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;
    // if ((value || '').trim()) {
    //   this.composers.push({
    //     id: Math.random(),
    //     name: value.trim(),
    //     description: '',
    //   });
    // }
    // if (input) {
    //   input.value = '';
    // }
    // this.composerCtrl.setValue(null);
  }

  removeComposer(idx): void {
    this.composers.splice(idx, 1);
  }

  selectedComposer(event: MatAutocompleteSelectedEvent): void {
    this.composers.push(event.option.value);
    this.composerInput.nativeElement.value = '';
    this.composerCtrl.setValue(null);
  }

  private _filterComposer(value: any): any[] {
    return this.listComposer.filter((composer) =>
      composer.nickName.toLowerCase().includes(value?.nickName === undefined ? value : value.nickName.toLowerCase())
    );
  }

  ngOnInit(): void {

    // Init composer
    this.listComposer.push(this.initArtist);
    this.filteredComposers = this.composerCtrl.valueChanges.pipe(
      startWith(''),
      map((composer: Artist | null) => this.listComposer?.slice()
      )
    );

    // Init singer
    this.listSinger.push(this.initArtist);
    this.filteredSingers = this.singerCtrl.valueChanges.pipe(
      startWith(''),
      map((singer: Artist | null) => this.listSinger?.slice()
      )
    );

    this.genreService.listGenre().subscribe((response: any) => {
      this.listGenre = response.data;
      this.filteredGenres = this.genreCtrl.valueChanges.pipe(
        startWith(''),
        map((genre: Genre | null) =>
          genre ? this._filterGenre(genre) : this.listGenre?.slice()
        )
      );
    });

    this.albumService.listAlbum().subscribe((response: any) => {
      this.listAlbum = response.data;
      this.filteredAlbums = this.albumCtrl.valueChanges.pipe(
        startWith(''),
        map((album: Album | null) =>
          album ? this._filterAlbum(album) : this.listAlbum?.slice()
        )
      );
    });

    this.commonService.listCategory().subscribe((response: any) => (this.listCategory = response.data));

    this.singerCtrl.valueChanges.subscribe((val: any) => {
      if (val !== "" && (typeof val !== "object"))
        this.commonService.listSinger(val).subscribe((response) => {
          this.listSinger = response.data;
        });
    });

    this.composerCtrl.valueChanges.subscribe((val) => {
      if (val !== "" && (typeof val !== "object"))
        this.commonService.listComposer(val).subscribe((response) => {
          this.listComposer = response.data;
        });
      });
  
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onUploadSong(ngForm: NgForm) {

    if (this.uploadSongFormGroup.invalid) {
      this.uploadSongFormGroup.markAllAsTouched();
    } else if (this.singers.length !== 0 && this.composers.length && this.genres.length && this.songFile === undefined && this.trackUpload.category.id !== undefined) {
      this.toastr.error('Vui lòng chọn file bài hát');
    } else {
      const formData = this.trackService.createTrackFormData(
        ngForm.value,
        this.genres,
        this.singers,
        this.composers,
        this.albums[0],
        this.songFile
      );
      
      this.showLoading = true;
  
      this.subscriptions.push(
        this.trackService.addTrack(formData)
        .pipe(finalize(() => (this.showLoading = false)))
        .subscribe(
          (response: any) => {
            this.toastr.success('Thêm bài hát thành công');
          },
          (error: any) => {
            this.toastr.error(error.error.errorMessage);
          }
        )
      );
    }
    
  }

  onUploadAlbum(ngForm: NgForm) {

    if (this.uploadAlbumFormGroup.invalid) {
      this.uploadAlbumFormGroup.markAllAsTouched();
    } else {
      const formData = this.albumService.createAlbumFormData(
        ngForm.value,
        this.genres,
        this.singers,
        this.albumImageFile,
        this.songFileArr
      );
      this.showLoading = true;
  
      this.subscriptions.push(
        this.albumService.addAlbum(formData)
        .pipe(finalize(() => (this.showLoading = false)))
        .subscribe(
          (response: any) => {
            this.toastr.success('Thêm album thành công');
          },
          (error: any) => {
            this.toastr.error(error.error.errorMessage);
          }
        )
      );
    }
    
  }

  // upload song
  onImageChange(event: any) {
    this.imageFile = event.target.files[0];
    var reader = new FileReader();

    reader.addEventListener(
      'load',
      function () {
        document.getElementById('avatar_big_upload').style.background =
          'url(' + reader.result + ')';
        document.getElementById('avatar_big_upload').style.backgroundSize =
          'cover';
      },
      false
    );

    if (this.imageFile) {
      reader.readAsDataURL(this.imageFile);
    }
  }

  onUploadImage(): void {
    document.getElementById('imageFile').click();
  }

  // upload album
  onAlbumImageChange(event: any) {
    this.albumImageFile = event.target.files[0];
    var reader = new FileReader();

    reader.addEventListener(
      'load',
      function () {
        document.getElementById('avatar_big_upload').style.background =
          'url(' + reader.result + ')';
        document.getElementById('avatar_big_upload').style.backgroundSize =
          'cover';
      },
      false
    );

    if (this.albumImageFile) {
      reader.readAsDataURL(this.albumImageFile);
    }
  }

  onUploadAlbumImage(): void {
    document.getElementById('albumImageFile').click();
  }

  onRemoveTrack(index): void {
    this.songFileArr.splice(index, 1);
  }

  // drag and drop file
  upload(e) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file = e as HTMLInputElement;
      const url = URL.createObjectURL(file[i]);
      this.songImageArr.push(url);
      this.songFileArr.push({ item, url: url });
    });

    this.songFileArr.forEach((item) => {
      this.fileObj.push(item.item);
    });

    this.songFile = this.songFileArr[0].item;
  }

  // Track validate

  get name(): AbstractControl {
    return this.uploadSongFormGroup.get('name');
  }

  get singersFormControl(): AbstractControl {
    return this.uploadSongFormGroup.get('singersFormControl');
  }

  get composersFormControl(): AbstractControl {
    return this.uploadSongFormGroup.get('composersFormControl');
  }

  get genresFormControl(): AbstractControl {
    return this.uploadSongFormGroup.get('genresFormControl');
  }

  get category(): AbstractControl {
    return this.uploadSongFormGroup.get('category');
  }

  // Album validate

  get nameAlbum(): AbstractControl {
    return this.uploadAlbumFormGroup.get('name');
  }

  get singersAlbumFormControl(): AbstractControl {
    return this.uploadAlbumFormGroup.get('singersFormControl');
  }

  get composersAlbumFormControl(): AbstractControl {
    return this.uploadAlbumFormGroup.get('composersFormControl');
  }

  get genresAlbumFormControl(): AbstractControl {
    return this.uploadAlbumFormGroup.get('genresFormControl');
  }

  get categoryAlbum(): AbstractControl {
    return this.uploadAlbumFormGroup.get('category');
  }

  get musicProduction(): AbstractControl {
    return this.uploadAlbumFormGroup.get('musicProduction');
  }

  get musicYear(): AbstractControl {
    return this.uploadAlbumFormGroup.get('musicYear');
  }
}
