import { Album } from "./album.model";
import { AppStatus } from "./app-status.model";
import { AppUser } from "./app-user.model";
import { Artist } from "./artist.model";
import { Category } from "./category.model";
import { Genre } from "./genre.model";

export class Track {
    id: number;
    album: Album;
    user: AppUser
    singers: Artist[];
    composers: Artist[];
    genre: Genre[];
    name: string;
    lyric: string;
    imageFile: string;
    trackUrl: string;
    musicProduction: string;
    musicYear: number;
    description: string;
    category: Category;
    appStatus: AppStatus;
    durationSeconds: number;
    bitRate: number;
    isActive: boolean;
    liked: number;
    listened: number;

    constructor() {
        this.name = "";
        this.lyric = "";
        this.imageFile = "";
        this.trackUrl = "";
        this.category = new Category();
        this.musicProduction = "";
        this.description = "";
        this.isActive = true;
        this.liked = 0;
        this.listened = 0;
    }
}