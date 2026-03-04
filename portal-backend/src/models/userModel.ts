import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';

export interface IUserDocument extends IUser, Document {
    id: string;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
