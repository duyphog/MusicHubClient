import { AppRole } from "./app-role.model";
import { AppAuthority } from './app-authority.model';
import { UserInfo } from "./user-info.model";
import { VerificationToken } from "./verification-token.model";

export class AppUser {
    id: number;
    username: string;
    password: string;
    email: string;
    enabled: boolean;
    accountNonLocked: boolean;
    appRole: AppRole[];
    appAuthorities: AppAuthority[]; 
    userInfo: UserInfo;
    verificationToken: VerificationToken[];
    dateNew: Date;
    userNew: string;
    dateEdit: Date;
    userEdit: string;

    constructor() {
        this.username = '';
        this.password = '';
        this.email = '';
        this.enabled = false;
        this.accountNonLocked = false;
        this.userNew = '';
        this.userEdit = '';
    }
}