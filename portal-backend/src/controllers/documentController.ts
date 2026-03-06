import { Request, Response, NextFunction } from 'express';
import { getPresignedUploadUrl } from '../helpers/s3Helper';
import { DocumentUploadModel } from '../models/documentModel';
import { DocumentType } from '../interfaces/DocumentType';
import { sendSuccess, sendError } from '../helpers/responseHelper';

export const generatePresignedUrl = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { fileName, contentType } = req.body;
        const user = req.user;

        if (!user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        if (!fileName || !contentType) {
            sendError(res, 'File name and content type are required', 400);
            return;
        }

        // Generate S3 Pre-signed URL using our helper
        const presignedData = await getPresignedUploadUrl(fileName, contentType, user._id.toString());

        sendSuccess(res, 'Pre-signed URL generated successfully', presignedData);
    } catch (error: any) {
        next(error);
    }
};

export const saveDocumentRecord = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { documentType, files } = req.body;
        const user = req.user;

        if (!user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        if (!documentType || !files || !Array.isArray(files) || files.length === 0) {
            sendError(res, 'Missing required fields for document record', 400);
            return;
        }

        // Ensure the document type is valid based on Enum
        if (!Object.values(DocumentType).includes(documentType)) {
            sendError(res, 'Invalid document type. Accepted types are: Australian Passport, Australian Driver Licence, Resume, Other.', 400);
            return;
        }

        // Check if a document of this type already exists for the user (except "Other")
        if (documentType !== DocumentType.OTHER) {
            const existingDoc = await DocumentUploadModel.findOne({ userId: user._id, documentType });
            if (existingDoc) {
                // We could update it or reject it, let's update for now or just allow it if re-uploading
                existingDoc.files = files;
                existingDoc.uploadStatus = 'Completed';
                await existingDoc.save();

                sendSuccess(res, 'Document updated successfully', existingDoc);
                return;
            }
        }

        // Save new document to MongoDB
        const newDocument = await DocumentUploadModel.create({
            userId: user._id,
            documentType,
            files,
            uploadStatus: 'Completed' // You could make this 'Pending Verification' if there's a manual review step
        });

        sendSuccess(res, 'Document record saved successfully', newDocument, 201);
    } catch (error: any) {
        next(error);
    }
};

export const getUserDocuments = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        const documents = await DocumentUploadModel.find({ userId: user._id });

        sendSuccess(res, 'Documents retrieved successfully', documents);
    } catch (error: any) {
        next(error);
    }
};
