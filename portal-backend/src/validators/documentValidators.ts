import { z } from 'zod';
import { IDocumentType } from '../interfaces/IDocumentType';

// Define the validation schema for presigned URL generation
export const presignedUrlSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    contentType: z.string().min(1, 'Content type is required'),
});

// Define the validation schema for saving document records
export const saveDocumentSchema = z.object({
    documentType: z.nativeEnum(IDocumentType, {
        message: 'Invalid document type. Accepted types are: PASSPORT, DRIVERS_LICENCE, RESUME, OTHER.'
    }),
    files: z.array(
        z.object({
            documentUrl: z.string().url('Invalid document URL'),
            documentName: z.string().min(1, 'Document name is required'),
            s3Key: z.string().min(1, 'S3 key is required'),
            mimeType: z.string().min(1, 'Mime type is required')
        })
    ).min(1, 'At least one file is required'),
});

// Define the validation schema for saving document records
export const updateDocumentStatusSchema = z.object({
    documentType: z.nativeEnum(IDocumentType, {
        message: 'Invalid document type. Accepted types are: PASSPORT, DRIVERS_LICENCE, RESUME, OTHER.'
    }),
    files: z.array(
        z.object({
            externalRefId: z.string().min(1, 'External Ref ID is required')
        })
    ).min(1, 'At least one file is required'),
});
