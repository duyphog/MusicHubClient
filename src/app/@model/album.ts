import { AppStatus } from "./app-status";
import { AppUser } from "./app-user";
import { Artist } from "./artist";
import { Category } from "./category";

export class Album {
    id: number;
    name: string;
    musicProduction: string;
    musicYear: number;
    imgUrl: string;
    category: Category;
    appStatus: AppStatus;
    singers: Artist[];
    genres: Artist[];
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