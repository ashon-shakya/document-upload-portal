export enum IDocumentType {
    PASSPORT = 'PASSPORT',
    DRIVERS_LICENCE = 'DRIVERS_LICENCE',
    RESUME = 'RESUME',
    OTHER = 'OTHER' // Allow other documents just in case
}

export enum DocumentStatus {
    PROCESSING = "PROCESSING",
    UPLOADED = "UPLOADED",
    CLASSIFICATION_PASSED = "CLASSIFICATION_PASSED",
    CLASSIFICATION_FAILED = "CLASSIFICATION_FAILED",
    CHECK_COMPLETE = "CHECK_COMPLETE",
    CHECK_FAILED = "CHECK_FAILED",
    CHECK_PENDING = "CHECK_PENDING"
}


export enum MimeType {
    IMAGE_PNG = "image/png",
    IMAGE_JPG = "image/jpeg"
}