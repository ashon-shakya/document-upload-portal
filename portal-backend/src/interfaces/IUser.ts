export interface IUser {
    id?: string;
    fullName: string;
    username: string;
    email: string;
    password?: string;
    profileImageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userStatus?: string;
}
