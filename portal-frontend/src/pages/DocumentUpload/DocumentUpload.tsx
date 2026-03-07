import React, { useState, useEffect } from 'react';
import { Check, Clock, FileText, Upload, RefreshCw, Book, IdCard, ChevronDown, X } from 'lucide-react';
import apiProcessor from '../../api/apiProcessor';
import UploadModal from '../../components/UploadModal/UploadModal';
import { DocumentStatus, type DocumentTypeKey } from '../../interfaces/DocumentType';

import type { UploadedDocument } from '../../interfaces/UploadedDocument';

const DocumentUpload = () => {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [additionalDocType, setAdditionalDocType] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDocumentType, setActiveDocumentType] = useState<DocumentTypeKey | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await apiProcessor.get('/documents');
            if (response.data && response.data.data) {
                setDocuments(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch documents', error);
        }
    };

    const handleUploadClick = (type: DocumentTypeKey) => {
        setActiveDocumentType(type);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setActiveDocumentType(null);
    };

    const handleUploadSuccess = async () => {
        await fetchDocuments();
        if (activeDocumentType === 'OTHER') {
            setAdditionalDocType('');
        }
    };

    const getDocumentByType = (type: DocumentTypeKey) => {
        return documents.find(d => d.documentType === type);
    };

    const DocumentProgress = () => {
        let count = 0;
        if (getDocumentByType('PASSPORT')) count++;
        if (getDocumentByType('DRIVERS_LICENCE')) count++;
        if (getDocumentByType('RESUME')) count++;
        return count;
    };

    const uploadedCount = DocumentProgress();
    const requiredCount = 3;
    const progressPercent = (uploadedCount / requiredCount) * 100;

    const renderDocumentCard = (
        title: DocumentTypeKey,
        icon: React.ReactNode,
        description: string,
        isAdditional: boolean = false
    ) => {
        const doc = getDocumentByType(title);

        if (isAdditional && !doc) return null;

        if (doc && doc.files && doc.files.length > 0) {
            return (
                <div key={title} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center bg-white rounded-xl border-2 border-brand p-5 justify-between shadow-sm ">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand flex-shrink-0">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">{title}</h3>
                            <div className="flex flex-col gap-2">
                                {doc.files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">

                                        {
                                            f.status === 'VERIFICATION_PASSED' ?
                                                <>
                                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        <Check size={12} strokeWidth={3} /> {DocumentStatus[f.status]}
                                                    </span>
                                                </> :
                                                f.status === 'CLASSIFICATION_FAILED' || f.status === 'VERIFICATION_FAILED' ?
                                                    <>
                                                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                            <X size={12} strokeWidth={3} /> {DocumentStatus[f.status]}
                                                        </span>
                                                    </> :
                                                    f.status === 'PENDING_VERIFICATION' ?
                                                        <>
                                                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                <Clock size={12} strokeWidth={3} /> {DocumentStatus[f.status]}
                                                            </span>
                                                        </> :
                                                        <>
                                                            <span className="inline-flex items-center gap-1 bg-brand-light text-brand text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                <Check size={12} strokeWidth={3} /> {DocumentStatus[f.status as keyof typeof DocumentStatus]}
                                                            </span>
                                                        </>
                                        }

                                        <span className="text-sm font-medium text-gray-text truncate max-w-[200px]" title={f.documentName}>
                                            {f.documentName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-text mt-2">
                                Last updated on {new Date(doc.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleUploadClick(title)}
                        className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} /> Upload again
                    </button>
                </div >
            );
        }

        return (
            <div key={title} className="bg-white rounded-xl border border-gray-border p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-badge-gray-bg rounded-lg flex items-center justify-center text-gray-text flex-shrink-0">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">{title}</h3>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="inline-flex items-center gap-1 bg-badge-gray-bg text-gray-text text-xs font-semibold px-2 py-0.5 rounded-full">
                                <Clock size={12} strokeWidth={3} /> Not uploaded
                            </span>
                        </div>
                        <p className="text-sm text-gray-text">{description}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleUploadClick(title)}
                    className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                    <Upload size={16} /> Upload
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-10 pb-20 mt-4 relative">
            {/* Modal Layer */}
            {activeDocumentType && (
                <UploadModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    documentType={activeDocumentType}
                    onSuccess={handleUploadSuccess}
                />
            )}

            {/* Document Upload Progress Card */}
            <div className="bg-white rounded-xl border border-gray-border p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-dark-text mb-1">Document Upload Progress</h2>
                        <p className="text-sm text-gray-text">Track your required document submissions</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-brand">{uploadedCount}</span>
                        <span className="text-sm text-gray-text ml-1">of {requiredCount} required</span>
                    </div>
                </div>

                <div className="w-full bg-gray-border h-2 rounded-full mb-3 overflow-hidden">
                    <div className="bg-brand h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-sm text-gray-text">{uploadedCount} of {requiredCount} required documents uploaded</p>
            </div>

            {/* Required Documents Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-dark-text mb-1">Required Documents</h2>
                    <p className="text-sm text-gray-text">Please upload all required documents to complete your onboarding</p>
                </div>

                <div className="flex flex-col gap-4">
                    {renderDocumentCard('RESUME', <FileText size={24} />, "Upload your most current resume")}
                    {renderDocumentCard('PASSPORT', <Book size={24} />, "Current and valid Australian Passport")}
                    {renderDocumentCard('DRIVERS_LICENCE', <IdCard size={24} />, "Current Australian driver licence")}
                </div>
            </div>

            {/* Additional Documents Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-dark-text mb-1">Additional Documents</h2>
                    <p className="text-sm text-gray-text">If you have been asked to provide additional documents, you can upload them here.</p>
                </div>

                {/* Show list of uploaded additional documents */}
                <div className="flex flex-col gap-4 mb-4">
                    {documents.filter(d => d.documentType === 'OTHER').map((doc, index) => (
                        <div key={doc._id} className="bg-white rounded-xl border-2 border-brand p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand flex-shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">Additional Document {index + 1}</h3>

                                    <div className="flex flex-col gap-2">
                                        {doc.files && doc.files.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="inline-flex items-center gap-1 bg-brand-light text-brand text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    <Check size={12} strokeWidth={3} /> {DocumentStatus[f.status as keyof typeof DocumentStatus]}
                                                </span>

                                                <span className="text-sm font-medium text-gray-text truncate max-w-[200px]" title={f.documentName}>
                                                    {f.documentName}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs text-gray-text mt-2">
                                        Uploaded on {new Date(doc.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-border p-5 mb-8 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-badge-gray-bg flex items-center justify-center text-gray-text rounded-lg shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="relative flex-1 max-w-sm">
                                <select
                                    className="w-full appearance-none bg-gray-bg border border-gray-border rounded-lg px-4 py-2.5 text-sm font-medium text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/20"
                                    value={additionalDocType}
                                    onChange={(e) => setAdditionalDocType(e.target.value)}
                                >
                                    <option value="" disabled>Select document type</option>
                                    <option value={'OTHER'}>Other Document</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none" size={16} />
                            </div>
                        </div>

                        <button
                            onClick={() => handleUploadClick('OTHER')}
                            className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors
                                ${!additionalDocType
                                    ? 'bg-[#f2e6ff] text-[#a370e0] cursor-not-allowed'
                                    : 'bg-brand hover:bg-brand-dark text-white'}`}
                            disabled={!additionalDocType}
                        >
                            <Upload size={16} /> Upload
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end">
                <button
                    className={`flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm
                        ${uploadedCount === requiredCount ? 'bg-brand hover:bg-brand-dark' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={uploadedCount < requiredCount}
                >
                    <Check size={18} /> Confirm
                </button>
            </div>
        </div>
    );
};

export default DocumentUpload;
