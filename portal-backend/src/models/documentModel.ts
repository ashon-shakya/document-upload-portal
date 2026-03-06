import mongoose, { Schema, Document } from 'mongoose';

import { DocumentType } from '../interfaces/DocumentType';

import { IDocumentUpload } from '../interfaces/IDocumentUpload';

const DocumentUploadSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: {
        type: String,
        enum: Object.values(DocumentType),
        required: true
    },
    files: [{
        documentUrl: { type: String, required: true },
        documentName: { type: String, required: true },
        s3Key: { type: String, required: true }
    }],
    uploadStatus: { type: String, default: 'Completed' }
}, { timestamps: true });

export const DocumentUploadModel = mongoose.model<IDocumentUpload>('DocumentUpload', DocumentUploadSchema);
