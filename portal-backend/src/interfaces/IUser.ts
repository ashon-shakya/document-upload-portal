export interface IUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string; // Storing as plaintext for this mock, but normally would be hashed
    createdAt: Date;
}
