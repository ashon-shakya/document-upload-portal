import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import apiProcessor from '../../api/apiProcessor';
import axios from 'axios';

import type { UploadModalProps } from '../../interfaces/UploadModalProps';
import { DocumentType } from '../../interfaces/DocumentType';

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, documentType, onSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const isImageOnly = documentType === DocumentType.PASSPORT || documentType === DocumentType.DRIVER_LICENCE;
    const isResume = documentType === DocumentType.RESUME;

    const acceptTypes = isImageOnly ? "image/jpeg, image/png, image/jpg" : (isResume ? ".pdf,.doc,.docx" : "*");
    const allowMultiple = isImageOnly || documentType === DocumentType.OTHER;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Validate types
        const validFiles = newFiles.filter(file => {
            if (isImageOnly && !file.type.startsWith('image/')) return false;
            if (isResume && !file.type.includes('pdf') && !file.name.match(/\.(doc|docx)$/)) return false;
            return true;
        });

        if (validFiles.length !== newFiles.length) {
            alert('Some files were ignored because they did not match the required format.');
        }

        if (!allowMultiple) {
            setSelectedFiles([validFiles[0]].filter(Boolean));
        } else {
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        if (e.target) {
            e.target.value = ''; // Reset
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadSubmit = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);

        try {
            const uploadedFilesData = [];

            for (const file of selectedFiles) {
                // 1. Get Pre-signed URL
                const presignResponse = await apiProcessor.post('/documents/presigned-url', {
                    fileName: file.name,
                    contentType: file.type || 'application/octet-stream' // fallback
                });

                const { uploadUrl, s3Key, publicUrl } = presignResponse.data.data;

                // 2. Upload directly to S3
                await axios.put(uploadUrl, file, {
                    headers: { 'Content-Type': file.type || 'application/octet-stream' }
                });

                uploadedFilesData.push({
                    documentUrl: publicUrl,
                    documentName: file.name,
                    s3Key: s3Key
                });
            }

            // 3. Save Record in Backend
            await apiProcessor.post('/documents', {
                documentType,
                files: uploadedFilesData
            });

            onSuccess();
            onClose();
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload files. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-border">
                    <div>
                        <h2 className="text-xl font-bold text-dark-text">Upload {documentType}</h2>
                        <p className="text-sm text-gray-text mt-1">
                            {isImageOnly ? 'Please upload image files (JPG, PNG). You can upload multiple images.' :
                                isResume ? 'Please upload a PDF or DOCX file.' :
                                    'Please select the relevant files to upload.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="text-gray-text hover:bg-auth-gray-bg p-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Dropzone */}
                <div className="p-6 overflow-y-auto">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
                            ${isDragging ? 'border-brand bg-brand-light' : 'border-gray-border bg-auth-gray-bg hover:bg-gray-border/50'}
                            ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 
                            ${isDragging ? 'bg-brand text-white' : 'bg-white text-brand shadow-sm'}`}>
                            <Upload size={24} />
                        </div>
                        <h3 className="text-base font-semibold text-dark-text text-center mb-1">
                            Click or drag files to upload
                        </h3>
                        <p className="text-sm text-gray-text text-center">
                            {isImageOnly ? 'Images only (max 5MB)' :
                                isResume ? 'PDF or Word Documents only' :
                                    'Any file type'}
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={acceptTypes}
                            multiple={allowMultiple}
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                    </div>

                    {/* File List */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-dark-text mb-3">Selected Files ({selectedFiles.length})</h4>
                            <div className="flex flex-col gap-3">
                                {selectedFiles.map((file, idx) => (
                                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between bg-white border border-gray-border p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-brand-light text-brand rounded-lg flex items-center justify-center flex-shrink-0">
                                                {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <File size={20} />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-dark-text truncate">{file.name}</p>
                                                <p className="text-xs text-gray-text">{formatBytes(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                            disabled={isUploading}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-border flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-text hover:bg-gray-border transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUploadSubmit}
                        disabled={selectedFiles.length === 0 || isUploading}
                        className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-70"
                    >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
