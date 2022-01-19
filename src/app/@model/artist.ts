
export class Artist {
    id: number;
    name: string;
    description: string;
    number_of_track: number;
    number_of_follower: number;

    constructor() {
        this.name = "";
        this.description = "";
        this.number_of_track = 0;
        this.number_of_follower = 0;
    }
}