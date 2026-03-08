import { Request, Response, NextFunction } from 'express';
import { getPresignedUploadUrl } from '../helpers/s3Helper';
import { DocumentUploadModel } from '../models/documentModel';
import { UserModel } from '../models/userModel';
import { DocumentStatus, IDocumentType, MimeType } from '../interfaces/IDocumentType';
import { sendSuccess, sendError } from '../helpers/responseHelper';
import { IClassifyImage, IVerifyDocumentPayload, requiredChecks } from '../interfaces/ITruuthApi';
import { classifyApi, getFraudCheck, submitFraudCheck } from '../helpers/truuthApiHelpers';

export const generatePresignedUrl = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { fileName, contentType } = req.body;
        const user = req.user;
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

        // file upload Status
        let fileUploadStatus = DocumentStatus.UPLOADED;

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
                    fileUploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
                }
                else {
                    const apiCountryCode = classificationResponse.country?.code?.toLowerCase() || '';
                    const apiDocType = classificationResponse.documentType?.code || '';

                    if (apiCountryCode === 'aus' && apiDocType === documentType) {
                        fileUploadStatus = DocumentStatus.CLASSIFICATION_PASSED;

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

                            const verificationResponse = await submitFraudCheck(verificationPayload);

                            if (verificationResponse?.error || !verificationResponse) {
                                console.error('Verification error:', verificationResponse?.error || 'Empty response');
                                fileUploadStatus = DocumentStatus.CHECK_FAILED;
                            }
                            else {
                                // attach documentVerifiyId to each pending verification document
                                file.documentVerifyId = verificationResponse.documentVerifyId;
                                fileUploadStatus = DocumentStatus.CHECK_PENDING;
                            }
                        }
                    }
                    else {
                        fileUploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
                    }
                }
            } catch (error) {
                console.error('Classification API exception:', error);
                fileUploadStatus = DocumentStatus.CLASSIFICATION_FAILED;
            }
        }

        // update status of each file
        for (let file of files) {
            file.status = fileUploadStatus
        }

        // Check if a document of this type already exists for the user (except "Other") and send them for verificaiton
        if (documentType !== IDocumentType.OTHER) {

            // send for verificaiton
            // update status for each files
            const existingDoc = await DocumentUploadModel.findOne({ userId: user._id, documentType });

            if (existingDoc) {
                // We could update it or reject it, let's update for now or just allow it if re-uploading
                existingDoc.files = files;
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
        });

        sendSuccess(res, 'Document record saved successfully', newDocument, 201);
    } catch (error: any) {
        next(error);
    }
};

export const getUserDocuments = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        const documents = await DocumentUploadModel.find({ userId: user._id });

        sendSuccess(res, 'Documents retrieved successfully', documents);
    } catch (error: any) {
        next(error);
    }
};

export const submitDocuments = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;

        await UserModel.findByIdAndUpdate(user._id, { userStatus: 'DOCUMENT_SUBMITTED' });

        sendSuccess(res, 'Documents submitted successfully', null);
    } catch (error: any) {
        next(error);
    }
};

export const restartDocuments = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;

        // Reset user status
        await UserModel.findByIdAndUpdate(user._id, { userStatus: 'NEW' });

        // Delete all uploaded documents for this user
        await DocumentUploadModel.deleteMany({ userId: user._id });

        sendSuccess(res, 'Upload progress restarted successfully', null);
    } catch (error: any) {
        next(error);
    }
};

export const updateUserDocumentStatus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        const { files } = req.body;

        const externalRefIds = files.map((f: any) => f.externalRefId);

        const documentsToCheck = await DocumentUploadModel.find({
            userId: user._id,
            'files.externalRefId': { $in: externalRefIds },
            'files.status': DocumentStatus.CHECK_PENDING
        });

        for (const doc of documentsToCheck) {
            let isModified = false;

            for (const file of doc.files) {
                if (file.status === DocumentStatus.CHECK_PENDING && externalRefIds.includes(file.externalRefId)) {
                    if (file.documentVerifyId) {
                        try {
                            const fraudCheckRes = await getFraudCheck(file.documentVerifyId);

                            if (fraudCheckRes) {
                                // Store the result directly into the file schema (Schema.Types.Mixed)
                                file.verificationResult = fraudCheckRes;

                                if (fraudCheckRes.status === 'DONE') {
                                    file.status = DocumentStatus.CHECK_COMPLETE;
                                } else if (fraudCheckRes.status === 'PROCESSING') {
                                    file.status = DocumentStatus.CHECK_PENDING;
                                } else if (fraudCheckRes.error) {
                                    file.status = DocumentStatus.CHECK_FAILED;
                                }

                                isModified = true;
                            }
                        } catch (err) {
                            console.error(`Failed to get fraud check for documentVerifyId ${file.documentVerifyId}`, err);
                        }
                    }
                }
            }

            if (isModified) {
                // Mongoose needs to know the nested array was modified
                doc.markModified('files');
                await doc.save();
            }
        }

        sendSuccess(res, 'Documents fraud check status updated successfully', documentsToCheck);
    } catch (error: any) {
        next(error);
    }
}

