export interface IClassifyImage {
    url: string;
    mimeType: string;
}

export interface IVerifyDocumentPayload {
    document: {
        image: IClassifyImage;
        countryCode: string;
        documentType: string;
    };
    options: {
        requiredChecks: { name: string }[];
    };
    externalRefId: string;
}

export const requiredChecks = [{ "name": "ANNOTATION" }, { "name": "C2PA" }, { "name": "COMPRESSION_HEATMAP" }, { "name": "DEEPFAKE_2" }, { "name": "DEEPFAKE_3" }, { "name": "DEEPFAKE_4" }, { "name": "DEEPFAKE_5" }, { "name": "DEEPFAKE_6" }, { "name": "DEEPFAKE_7" }, { "name": "DEEPFAKE" }, { "name": "EOF_COUNT" }, { "name": "HANDWRITING" }, { "name": "INVOICE_DATE_ANOMALY_CHECK" }, { "name": "INVOICE_TOTAL_ANOMALY_CHECK" }, { "name": "SCREENSHOT" }, { "name": "SOFTWARE_EDITOR" }, { "name": "SOFTWARE_FINGERPRINT" }, { "name": "TIMESTAMP" }, { "name": "VENDOR_MISSING_FIELDS" }, { "name": "VENDOR_VALIDATION" }, { "name": "VISUAL_ANOMALY" }, { "name": "WATERMARK_CHECK" }]