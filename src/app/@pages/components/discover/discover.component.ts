import { Component, OnInit } from '@angular/core';
import { Playlist } from 'src/app/@model/playlist.model';
import { PlaylistService } from './../../../@services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@services/common.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  listPlaylist: Playlist[] = [];
  defaultImage = 'assets/images/my-logo.png';
  currentPlaylistTypeName: string;

  constructor(private playlistService: PlaylistService, private route: ActivatedRoute, public commonService: CommonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getListPlaylist();
    })
    this.commonService.getCurrentPlaylistType().subscribe((response: any) => {
      this.currentPlaylistTypeName = response;
    });
  }

  getListPlaylist() {
    const hasPlaylistTypeId = this.route.snapshot.paramMap.has('id');

    if (hasPlaylistTypeId) {
      const playlistTypeId = +this.route.snapshot.paramMap.get('id');
      this.playlistService.getPlaylistByPlaylistTypeId(playlistTypeId).subscribe((response: any) => {
        this.listPlaylist = response.data;
      });
    }
  }

}
