import React, { useState, useEffect } from 'react';
import { Check, Clock, FileText, Upload, RefreshCw, Book, IdCard, ChevronDown, X } from 'lucide-react';
import apiProcessor from '../../api/apiProcessor';
import UploadModal from '../../components/UploadModal/UploadModal';
import ResultModal from '../../components/ResultModal/ResultModal';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUserData } from '../../store/userSlice';
import { DocumentType, DocumentStatus, type DocumentTypeKey } from '../../interfaces/DocumentType';

import type { UploadedDocument } from '../../interfaces/UploadedDocument';

const DocumentUpload = () => {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [additionalDocType, setAdditionalDocType] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDocumentType, setActiveDocumentType] = useState<DocumentTypeKey | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<any>(null);

    const user = useAppSelector(state => state.user.userData);
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // Find all files that are pending a check
            const pendingFiles = documents.flatMap(doc => doc.files).filter(f => f.status === 'CHECK_PENDING');

            if (pendingFiles.length > 0) {
                try {
                    const payload = {
                        documentType: 'OTHER', // The backend schema requires this field, though only files are used for polling logic
                        files: pendingFiles.map(f => ({ externalRefId: f.externalRefId }))
                    };

                    const response = await apiProcessor.post('/documents/update-status', payload);

                    // If the backend returned updated documents, we refresh our state
                    if (response.data && response.data.data) {
                        setDocuments(docs => {
                            // Merge updated documents into existing state
                            const updatedDocsMap = new Map((response.data.data as UploadedDocument[]).map(d => [d._id, d]));
                            return docs.map(d => updatedDocsMap.has(d._id) ? updatedDocsMap.get(d._id)! : d);
                        });
                    }
                } catch (error) {
                    console.error('Failed to poll document status', error);
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [documents]);

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

    const isPassportComplete = documents.some(d => d.documentType === 'PASSPORT' && d.files.some(f => f.status === 'CHECK_COMPLETE'));
    const isDriversLicenceComplete = documents.some(d => d.documentType === 'DRIVERS_LICENCE' && d.files.some(f => f.status === 'CHECK_COMPLETE'));
    const isResumeUploaded = documents.some(d => d.documentType === 'RESUME' && d.files.some(f => f.status === 'UPLOADED' || f.status === 'CHECK_COMPLETE'));
    const canSubmit = isPassportComplete && isDriversLicenceComplete && isResumeUploaded;

    const handleSubmit = async () => {
        try {
            await apiProcessor.post('/documents/submit');
            if (user) {
                dispatch(setUserData({ ...user, userStatus: 'DOCUMENT_SUBMITTED' }));
            }
        } catch (error) {
            console.error('Failed to submit documents', error);
        }
    };

    const handleRestart = async () => {
        try {
            await apiProcessor.post('/documents/restart');
            if (user) {
                dispatch(setUserData({ ...user, userStatus: 'NEW' }));
            }
            setDocuments([]);
        } catch (error) {
            console.error('Failed to restart documents', error);
        }
    };

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
                        <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand shrink-0">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">{DocumentType[title]}</h3>
                            <div className="flex flex-col gap-2">
                                {doc.files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">

                                        {
                                            f.status === 'CHECK_COMPLETE' ?
                                                <>
                                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        <Check size={12} strokeWidth={3} /> {DocumentStatus[f.status]}
                                                    </span>
                                                </> :
                                                f.status === 'CLASSIFICATION_FAILED' || f.status === 'CHECK_FAILED' ?
                                                    <>
                                                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                            <X size={12} strokeWidth={3} /> {DocumentStatus[f.status]}
                                                        </span>
                                                    </> :
                                                    f.status === 'CHECK_PENDING' ?
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
                                        {f.status === 'CHECK_COMPLETE' && f.verificationResult && (
                                            <button
                                                onClick={() => {
                                                    setSelectedResult(f.verificationResult);
                                                    setIsResultModalOpen(true);
                                                }}
                                                className="text-xs text-brand hover:underline font-semibold ml-2 inline-flex items-center gap-1"
                                            >
                                                View Result
                                            </button>
                                        )}
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
                    <div className="w-12 h-12 bg-badge-gray-bg rounded-lg flex items-center justify-center text-gray-text shrink-0">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">{DocumentType[title]}</h3>
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
                    {documents.some(doc => doc.files.some(f => f.status === 'CHECK_PENDING')) ? (
                        <div
                            className="h-full rounded-full transition-all duration-500 bg-size[200%, 200%] animate-[bg-pan-right_2s_linear_infinite]"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundImage: `linear-gradient(90deg, #7D3C98 0%, #a370e0 50%, #7D3C98 100%)`
                            }}
                        ></div>
                    ) : (
                        <div className="bg-brand h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    )}
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
                                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand shrink-0">
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
                                                {f.status === 'CHECK_COMPLETE' && f.verificationResult && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedResult(f.verificationResult);
                                                            setIsResultModalOpen(true);
                                                        }}
                                                        className="text-xs text-brand hover:underline font-semibold ml-2 inline-flex items-center gap-1"
                                                    >
                                                        View Result
                                                    </button>
                                                )}
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
                    onClick={handleSubmit}
                    className={`flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm
                        ${canSubmit ? 'bg-brand hover:bg-brand-dark' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!canSubmit}
                >
                    <Check size={18} /> Submit
                </button>
            </div>

            {/* Submission Success Modal */}
            {user?.userStatus === 'DOCUMENT_SUBMITTED' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-50 border-4 border-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark-text mb-3">Thank you for your submission!</h2>
                        <p className="text-gray-text mb-8 text-sm leading-relaxed">
                            We have securely received your documents. Our team is reviewing them and will be in touch with you shortly regarding next steps.
                        </p>
                        <button
                            onClick={handleRestart}
                            className="w-full flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-semibold text-brand bg-brand-light rounded-xl hover:bg-brand/20 transition-colors"
                        >
                            <RefreshCw size={18} /> Restart Process
                        </button>
                    </div>
                </div>
            )}

            {/* Verification Result Modal */}
            <ResultModal
                isOpen={isResultModalOpen}
                onClose={() => {
                    setIsResultModalOpen(false);
                    setSelectedResult(null);
                }}
                result={selectedResult}
            />
        </div>
    );
};

export default DocumentUpload;
