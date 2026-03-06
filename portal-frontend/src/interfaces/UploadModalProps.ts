import { DocumentType } from './DocumentType';

export interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentType;
    onSuccess: () => void;
}
