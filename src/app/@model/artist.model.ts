
export class Artist {
    id: number;
    nickName: string;
    avatarImgUrl: string;
    birthday: Date;
    coverImgUrl: string;
    gender: boolean;
    isActive: boolean;
    isComposer: boolean;
    isSinger: boolean;

    constructor() {
        this.nickName = '';
        this.avatarImgUrl = '';
        this.birthday = new Date();
        this.coverImgUrl = '';
        this.gender = true;
        this.isActive = true;
        this.isComposer = false;
        this.isSinger = false;        
    }
}