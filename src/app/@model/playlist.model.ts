
import { Category } from 'src/app/@model/category.model';
import { Genre } from './genre.model';
import { PlaylistType } from './playlist-type.model';
import { AppUser } from './app-user.model';
import { PlaylistDetail } from './playlist-detail.model';

export class Playlist {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    imagePath: string;
    category: Category;
    genre: Genre;
    playlistType: PlaylistType;
    isPublic: boolean;
    liked: number;
    listened: number;
    appUser: AppUser;
    playlistDetails: PlaylistDetail[];
    
    constructor() {
        this.name = '';
        this.description = '';
        this.imageUrl = '';
        this.imagePath = '';
        this.isPublic = false;
        this.liked = 0;
        this.listened = 0;
        this.category = new Category();
        this.genre = new Genre();
        this.playlistType = new PlaylistType();
        this.appUser = new AppUser();
        this.playlistDetails = new Array<PlaylistDetail>();
    }
}