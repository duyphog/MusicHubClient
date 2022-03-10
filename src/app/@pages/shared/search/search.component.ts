import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Album } from 'src/app/@model/album.model';
import { AlbumService } from 'src/app/@services/album.service';
import { Track } from './../../../@model/track.model';
import { TrackService } from 'src/app/@services/track.service';
import { PlaylistService } from './../../../@services/playlist.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  trackFormControl = new FormControl();
  tracks: Track[] = [];
  filteredTracks: Observable<Track[]>;
  listTrack: Track[];

  @ViewChild('trackInput') trackInput: ElementRef;
  
  constructor(private trackService: TrackService, private playlistService: PlaylistService) { }

  ngOnInit(): void {

    this.filteredTracks = this.trackFormControl.valueChanges.pipe(
      startWith(''),
      map((track: Track | null) => this.listTrack?.slice()
      )
    );

    this.trackFormControl.valueChanges.subscribe((val) => {
      if (val !== "")
        this.trackService.searchText(val, 0).subscribe((response: any) => {
          this.listTrack = response.data.content;
        });
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
}
