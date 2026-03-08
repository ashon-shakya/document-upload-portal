import mongoose, { Document } from 'mongoose';
import { IDocumentType } from './IDocumentType';

export interface IDocumentUploadFile {
    documentUrl: string;
    documentName: string;
    s3Key: string;
    status: string;
    mimeType: string;
    externalRefId?: string;
    documentVerifyId?: string;
    verificationResult?: any;
}

export interface IDocumentUpload extends Document {
    userId: mongoose.Types.ObjectId;
    documentType: IDocumentType;
    files: IDocumentUploadFile[];
    createdAt: Date;
    updatedAt: Date;
}
