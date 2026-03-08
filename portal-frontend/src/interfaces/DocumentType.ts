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
    CHECK_PENDING: 'Fraud Check Pending',
    CHECK_COMPLETE: 'Check Complete',
    CHECK_FAILED: 'Fraud Check Failed'
} as const;

export type DocumentTypeKey = keyof typeof DocumentType;
