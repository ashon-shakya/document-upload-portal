export const DocumentType = {
    PASSPORT: 'Australian Passport',
    DRIVER_LICENCE: 'Australian Driver Licence',
    RESUME: 'Resume',
    OTHER: 'Other'
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];
