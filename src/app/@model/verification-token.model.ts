
import { AppUser } from './app-user.model';

export class VerificationToken {
    id: number;
    appUser: AppUser;
    token: any;
    dateNew: Date;
    send: boolean;
    lastTime: Date;
    verify: boolean;
    verifyDate: Date;
}