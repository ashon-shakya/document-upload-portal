import { Request, Response, NextFunction } from 'express';
import { getPresignedUploadUrl } from '../helpers/s3Helper';
import { DocumentUploadModel } from '../models/documentModel';
import { DocumentStatus, IDocumentType, MimeType } from '../interfaces/IDocumentType';
import { sendSuccess, sendError } from '../helpers/responseHelper';
import { IClassifyImage, IVerifyDocumentPayload, requiredChecks } from '../interfaces/ITruuthApi';
import { classifyApi, verifyApi } from '../helpers/truuthApiHelpers';

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
        if (!Object.values(IDocumentType).includes(documentType)) {
            sendError(res, 'Invalid document type. Accepted types are: Passport, Driver Licence, Resume, Other.', 400);
            return;
        }


        // upload Status
        let uploadStatus = DocumentStatus.UPLOADED;

        // Call Classification API of PASSPORT & DRIVERS LICENCE
        if (documentType === IDocumentType.PASSPORT || documentType === IDocumentType.DRIVERS_LICENCE) {
            try {
                const uploadedImages: IClassifyImage[] = files.map((file: any) => {
                    return {
                        url: file.documentUrl,
                        mimeType: file.mimeType
                    };
                });

                const classificationResponse = await classifyApi(uploadedImages);

                if (classificationResponse?.error || !classificationResponse) {
                    console.error('Classification error:', classificationResponse?.error || 'Empty response');
                    uploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
                }
                else {
                    const apiCountryCode = classificationResponse.country?.code?.toLowerCase() || '';
                    const apiDocType = classificationResponse.documentType?.code || '';

                    if (apiCountryCode === 'aus' && apiDocType === documentType) {
                        uploadStatus = DocumentStatus.CLASSIFICATION_PASSED;

                        for (let file of files) {

                            // send each file for verification
                            const externalRefId = `ext-ref-${crypto.randomUUID()}`
                            file.externalRefId = externalRefId;

                            const verificationPayload: IVerifyDocumentPayload = {
                                document: {
                                    image: {
                                        url: file.documentUrl,
                                        mimeType: file.mimeType
                                    },
                                    countryCode: "AUS",
                                    documentType
                                },
                                options: {
                                    requiredChecks
                                },
                                externalRefId
                            }

                            const verificationResponse = await verifyApi(verificationPayload);

                            if (verificationResponse?.error || !verificationResponse) {
                                console.error('Verification error:', verificationResponse?.error || 'Empty response');
                                uploadStatus = DocumentStatus.VERIFICATION_FAILED;
                            }
                            else {
                                file.documentVerifyId = verificationResponse.documentVerifyId;
                                uploadStatus = DocumentStatus.PENDING_VERIFICATION;
                            }
                        }
                    }
                    else {
                        uploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
                    }
                }
            } catch (error) {
                console.error('Classification API exception:', error);
                uploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
            }
        }

        // update status of each file
        for (let file of files) {
            file.status = uploadStatus
        }

        // Check if a document of this type already exists for the user (except "Other") and send them for verificaiton
        if (documentType !== IDocumentType.OTHER) {

            // send for verificaiton
            // update status for each files
            const existingDoc = await DocumentUploadModel.findOne({ userId: user._id, documentType });

            if (existingDoc) {
                // We could update it or reject it, let's update for now or just allow it if re-uploading
                existingDoc.files = files;
                existingDoc.uploadStatus = uploadStatus;
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
            uploadStatus // You could make this 'Pending Verification' if there's a manual review step
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
