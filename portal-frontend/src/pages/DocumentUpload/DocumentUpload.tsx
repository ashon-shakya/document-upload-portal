import { Check, Clock, FileText, Upload, RefreshCw, FileImage, CreditCard, ChevronDown } from 'lucide-react';

const DocumentUpload = () => {
    return (
        <div className="flex flex-col gap-10 pb-20 mt-4">
            {/* Document Upload Progress Card */}
            <div className="bg-white rounded-xl border border-gray-border p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-dark-text mb-1">Document Upload Progress</h2>
                        <p className="text-sm text-gray-text">Track your required document submissions</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-brand">1</span>
                        <span className="text-sm text-gray-text ml-1">of 3 required</span>
                    </div>
                </div>

                <div className="w-full bg-gray-border h-2 rounded-full mb-3 overflow-hidden">
                    <div className="bg-brand h-full rounded-full" style={{ width: '33.33%' }}></div>
                </div>
                <p className="text-sm text-gray-text">1 of 3 required documents uploaded</p>
            </div>

            {/* Required Documents Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-dark-text mb-1">Required Documents</h2>
                    <p className="text-sm text-gray-text">Please upload all required documents to complete your onboarding</p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Resume - Completed */}
                    <div className="bg-white rounded-xl border-2 border-brand p-5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand flex-shrink-0">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">Resume</h3>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1 bg-brand-light text-brand text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <Check size={12} strokeWidth={3} /> Uploaded
                                    </span>
                                    <span className="text-sm font-medium text-gray-text">resume_2025.pdf</span>
                                </div>
                                <p className="text-xs text-gray-text mt-1">Uploaded on January 15, 2025 at 2:34 PM</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                            <RefreshCw size={16} /> Upload again
                        </button>
                    </div>

                    {/* W-2 Form - Pending */}
                    <div className="bg-white rounded-xl border border-gray-border p-5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-badge-gray-bg rounded-lg flex items-center justify-center text-gray-text flex-shrink-0">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">W-2 Form</h3>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="inline-flex items-center gap-1 bg-badge-gray-bg text-gray-text text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <Clock size={12} strokeWidth={3} /> Not uploaded
                                    </span>
                                </div>
                                <p className="text-sm text-gray-text">Most recent W-2 wage and tax statement</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                            <Upload size={16} /> Upload
                        </button>
                    </div>

                    {/* Visa Status Document - Pending */}
                    <div className="bg-white rounded-xl border border-gray-border p-5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-badge-gray-bg rounded-lg flex items-center justify-center text-gray-text flex-shrink-0">
                                <FileImage size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-dark-text leading-tight mb-2">Visa Status Document</h3>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="inline-flex items-center gap-1 bg-badge-gray-bg text-gray-text text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <Clock size={12} strokeWidth={3} /> Not uploaded
                                    </span>
                                </div>
                                <p className="text-sm text-gray-text">Current visa documentation or work authorization</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                            <Upload size={16} /> Upload
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Documents Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-dark-text mb-1">Additional Documents</h2>
                    <p className="text-sm text-gray-text">If you have been asked to provide additional documents, you can upload them here.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-border p-5 mb-8 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-badge-gray-bg flex items-center justify-center text-gray-text rounded-lg flex-shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="relative flex-1 max-w-sm">
                                <select className="w-full appearance-none bg-gray-bg border border-gray-border rounded-lg px-4 py-2.5 text-sm font-medium text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/20">
                                    <option value="" disabled selected>Select document type</option>
                                    <option value="id">ID Card</option>
                                    <option value="reference">Reference Letter</option>
                                    <option value="certificate">Certificate</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none" size={16} />
                            </div>
                        </div>
                        {/* Disabled styled upload button matching screenshot */}
                        <button
                            className="flex items-center gap-2 bg-[#f2e6ff] text-[#a370e0] cursor-not-allowed text-sm font-semibold px-6 py-2.5 rounded-xl"
                            disabled
                        >
                            <Upload size={16} /> Upload
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm">
                    <Check size={18} /> Confirm
                </button>
            </div>
        </div>
    );
};

export default DocumentUpload;
