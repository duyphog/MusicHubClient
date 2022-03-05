import { AppStatus } from "./app-status.model";
import { AppUser } from "./app-user.model";
import { Artist } from "./artist.model";
import { Category } from "./category.model";
import { Genre } from "./genre.model";
import { Track } from "./track.model";

export class Album {
    id: number;
    name: string;
    musicProduction: string;
    musicYear: number;
    imgUrl: string;
    category: Category;
    appStatus: AppStatus;
    tracks: Track[];
    singers: Artist[];
    genres: Genre[];
    
    appUser: AppUser;
    isActive: boolean;

    constructor() {
        this.name = "";
        this.musicProduction = "";
        this.imgUrl = "";
        this.singers = [];
        this.genres = [];
        this.isActive = false;
    }
}