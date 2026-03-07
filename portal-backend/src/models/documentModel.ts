import mongoose, { Schema, Document } from 'mongoose';
import { IDocumentType } from '../interfaces/IDocumentType';
import { IDocumentUpload } from '../interfaces/IDocumentUpload';

const DocumentUploadSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: {
        type: String,
        enum: Object.values(IDocumentType),
        required: true
    },
    files: [{
        documentUrl: { type: String, required: true },
        documentName: { type: String, required: true },
        s3Key: { type: String, required: true },
        mimeType: { type: String, required: true },
        status: { type: String, required: true },
        externalRefId: { type: String },
        documentVerifyId: { type: String }
    }],
    uploadStatus: { type: String, default: 'Processing' }
}, { timestamps: true });

export const DocumentUploadModel = mongoose.model<IDocumentUpload>('DocumentUpload', DocumentUploadSchema);
