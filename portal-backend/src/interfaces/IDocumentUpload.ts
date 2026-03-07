import mongoose, { Document } from 'mongoose';
import { IDocumentType } from './IDocumentType';

export interface IDocumentUploadFile {
    documentUrl: string;
    documentName: string;
    s3Key: string;
    status: string;
    mimeType: string;
}

export interface IDocumentUpload extends Document {
    userId: mongoose.Types.ObjectId;
    documentType: IDocumentType;
    files: IDocumentUploadFile[];
    uploadStatus: string;
    createdAt: Date;
    updatedAt: Date;
}
