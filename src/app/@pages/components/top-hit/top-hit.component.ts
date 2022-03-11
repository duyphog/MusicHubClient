import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/@services/track.service';
import { ActivatedRoute } from '@angular/router';
import { Track } from 'src/app/@model/track.model';
import { PlaylistService } from './../../../@services/playlist.service';
import { CommonService } from './../../../@services/common.service';

@Component({
  selector: 'app-top-hit',
  templateUrl: './top-hit.component.html',
  styleUrls: ['./top-hit.component.css']
})
export class TopHitComponent implements OnInit {

  listTrackTopHit: Track[] = [];
  defaultImage: string = 'assets/images/my-logo.png';
  currentCategoryName: string;

  constructor(private trackService: TrackService, private route: ActivatedRoute, private playlistService: PlaylistService, public commonService: CommonService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listTrack();
    })
    this.commonService.getCurrentCategory().subscribe((response: any) => {
      this.currentCategoryName = response;
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

  listTrack() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      const categoryId = +this.route.snapshot.paramMap.get('id');
      this.trackService.getTopHit(categoryId).subscribe((res: any) => {
        this.listTrackTopHit = res.data;
      });
    }
  }

  showIndex(index: number): string {
    if (index < 10) {
      return '0' + index;
    } else {
      return index.toString();
    }
  }

}
