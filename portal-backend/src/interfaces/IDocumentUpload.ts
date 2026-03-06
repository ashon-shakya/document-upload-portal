import mongoose, { Document } from 'mongoose';
import { DocumentType } from './DocumentType';

export interface IDocumentUploadFile {
    documentUrl: string;
    documentName: string;
    s3Key: string;
}

export interface IDocumentUpload extends Document {
    userId: mongoose.Types.ObjectId;
    documentType: DocumentType;
    files: IDocumentUploadFile[];
    uploadStatus: string;
    createdAt: Date;
    updatedAt: Date;
}
