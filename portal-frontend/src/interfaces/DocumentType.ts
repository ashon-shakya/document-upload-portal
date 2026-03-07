export const DocumentType = {
    PASSPORT: 'Passport',
    DRIVERS_LICENCE: 'Driver Licence',
    RESUME: 'Resume',
    OTHER: 'Other'
} as const;

export const DocumentStatus = {
    PROCESSING: "Processing",
    UPLOADED: 'Uploaded',
    CLASSIFICATION_PASSED: 'Classified',
    CLASSIFICATION_FAILED: 'Classification Failed',
    PENDING_VERIFICATION: 'Pending Verification',
    VERIFICATION_PASSED: 'Verified',
    VERIFICATION_FAILED: 'Verification Failed'
} as const;

export type DocumentTypeKey = keyof typeof DocumentType;
