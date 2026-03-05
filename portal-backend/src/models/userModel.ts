import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';

export interface User extends IUser, Document {
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    profileImageUrl: {
        type: String,
        required: false,
    }
}, { timestamps: true });

export const UserModel = mongoose.model<User>('User', UserSchema);
