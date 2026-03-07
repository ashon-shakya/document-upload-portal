export interface UploadedDocument {
    _id: string;
    documentType: string;
    files: {
        documentUrl: string;
        documentName: string;
        s3Key: string;
        status: string;
        documentVerifyId: string;
        externalRefId: string;
    }[];
    uploadStatus: string;
    createdAt: string;
}
