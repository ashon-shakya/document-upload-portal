import { type DocumentTypeKey } from './DocumentType';

export interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentTypeKey;
    onSuccess: () => void;
}
