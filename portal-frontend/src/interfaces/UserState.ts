import type { UserData } from './UserData';

export interface UserState {
    userData: UserData | null;
    isCheckingAuth: boolean;
}
