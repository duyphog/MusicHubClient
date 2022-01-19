
export class Track {
    id: number;
    albumId: number;
    artistId: number;
    name: string;
    lyric: string;
    imageUrl: string;
    fileUrl: string;
    number_of_view: number;
    number_of_downloaded: number;
    is_copy_track: boolean;

    constructor() {
        this.name = "";
        this.lyric = "";
        this.imageUrl = "";
        this.fileUrl = "";
        this.number_of_view = 0;
        this.number_of_downloaded = 0;
        this.is_copy_track = false;
    }
}