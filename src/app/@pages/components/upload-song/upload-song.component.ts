import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { ArtistService } from './../../../@services/artist.service';
import { Artist } from '../../../@model/artist';
import { GenreService } from './../../../@services/genre.service';
import { Genre } from './../../../@model/genre';
import { Track } from './../../../@model/track';
import { DomSanitizer } from '@angular/platform-browser';
import { DragDropService } from '../../../@services/drag-drop.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TrackService } from './../../../@services/track.service';
import { AppUtilService } from './../../../@services/app-util.service';

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
  msg: string;

  albumSongFile: File[];
  albumImageFile: File;
  
  trackUpload: Track = new Track();
  progress: number;
  refreshing: boolean;

  // artist
  visibleArtist = true;
  selectableArtist = true;
  removableArtist = true;
  addOnBlurArtist = false;
  separatorKeysCodesArtist : number[] = [ENTER, COMMA];
  artistCtrl = new FormControl();
  artists: Artist[] = [];
  filteredArtists: Observable<Artist[]>;
  listArtist: Artist[];

  @ViewChild('artistInput') artistInput: ElementRef;

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

  constructor(
    private artistService: ArtistService,
    private genreService: GenreService,
    // private sanitizer: DomSanitizer,
    // private toastr: ToastrService,
    // private trackService: TrackService,
    // private appUtilService: AppUtilService,
    public dragDropService: DragDropService
  ) {
    // Artist
    this.filteredArtists = this.artistCtrl.valueChanges.pipe(
      startWith(<string>null),
      map((artist: Artist | null) =>
        artist ? this._filterArtist(artist) : this.listArtist?.slice()
      )
    );
    // Genre
    this.filteredGenres = this.genreCtrl.valueChanges.pipe(
      startWith(<string>null),
      map((genre: Genre | null) =>
        genre ? this._filterGenre(genre) : this.listGenre?.slice()
      )
    );
  }

  // Artist
  addArtist(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.artists.push({
        id: Math.random(),
        name: value.trim(),
        description: '',
        number_of_track: 0,
        number_of_follower: 0,
      });
    }

    if (input) {
      input.value = '';
    }

    this.artistCtrl.setValue(null);
  }

  removeArtist(idx): void {
    this.artists.splice(idx, 1);
  }

  selectedArtist(event: MatAutocompleteSelectedEvent): void {
    this.artists.push(event.option.value);
    this.artistInput.nativeElement.value = '';
    this.artistCtrl.setValue(null);
  }

  private _filterArtist(value: Artist): Artist[] {
    return this.listArtist.filter((artist) =>
      artist.name.toLowerCase().includes(value.name?.toLowerCase())
    );
  }

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

  private _filterGenre(value: Genre): Genre[] {
    return this.listGenre.filter((genre) =>
      genre.name.toLowerCase().includes(value.name?.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.artistService
      .listArtist()
      .subscribe((data) => (this.listArtist = data));
    this.genreService
      .listGenre()
      .subscribe((data) => (this.listGenre = data));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onUploadSong(ngForm: NgForm) {
    console.log(ngForm.value);
    console.log(this.artists);
    console.log(this.genres);
  }

  onUploadAlbum(ngForm: NgForm) {
    console.log(this.albumSongFile);
    console.log(ngForm.value);
    console.log(this.artists);
    console.log(this.genres);
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
      const file = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.songImageArr.push(url);
      this.songFileArr.push({ item, url: url });
    })

    this.songFileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })

    this.songFile = this.songFileArr[0].item;

    // Upload to server
    // this.dragDropService.addFiles(this.form.value.avatar)
    //   .subscribe((event: HttpEvent<any>) => {
    //     switch (event.type) {
    //       case HttpEventType.Sent:
    //         console.log('Request has been made!');
    //         break;
    //       case HttpEventType.ResponseHeader:
    //         console.log('Response header has been received!');
    //         break;
    //       case HttpEventType.UploadProgress:
    //         this.progress = Math.round(event.loaded / event.total * 100);
    //         console.log(`Uploaded! ${this.progress}%`);
    //         break;
    //       case HttpEventType.Response:
    //         console.log('File uploaded successfully!', event.body);
    //         setTimeout(() => {
    //           this.progress = 0;
    //           this.fileArr = [];
    //           this.fileObj = [];
    //           this.msg = "File uploaded successfully!"
    //         }, 3000);
    //     }
    //   })
  }

  // onUploadSongFile(): void {
  //   const formData = new FormData();
  //   this.progress = 0;
  //   formData.append('songFile', this.songFile);

  //   this.subscriptions.push(this.trackService.uploadTrackFile(formData)
  //       .pipe(finalize(() => {this.refreshing = false; this.songFile = null; }))
  //       .subscribe(
  //         (event: any) => {
  //               if (event.type === HttpEventType.UploadProgress) {
  //                 this.progress = Math.round(100 * event.loaded / event.total);
  //               } else if (event.type === HttpEventType.Response) {
  //                 if (event.status === 200) {
  //                   // this.user.avatarImg = `${event.body.data}?time=${new Date().getTime()}`;
  //                   // this.appUtilService.addToLocalCache("user", this.user);
  //                   this.toastr.success('Song has been updload successfully');
  //                 } else {
  //                   this.toastr.error(`Unable to upload profile image. Please try again`);
  //                 }
  //               }
  //             }, error => this.toastr.error(error.error.errorMessage)
  //   ));
  // }
}
