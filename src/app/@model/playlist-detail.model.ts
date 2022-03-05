import { Playlist } from "./playlist.model";
import { Track } from "./track.model";


export class PlaylistDetail {
    id: number;
    playlist: Playlist;
    track: Track;
    dateNew: Date;

    constructor() {
        this.playlist = new Playlist();
        this.track = new Track();
        this.dateNew = new Date();
    }
}