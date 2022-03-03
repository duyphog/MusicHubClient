import { AppStatus } from "./app-status";
import { AppUser } from "./app-user";
import { Artist } from "./artist";
import { Category } from "./category";
import { Genre } from "./genre";
import { Track } from "./track";

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