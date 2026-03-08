import React from 'react';
import { X, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: any;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
    if (!isOpen || !result) return null;

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "fraud_check_result.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PASS':
                return <CheckCircle className="text-green-500" size={16} />;
            case 'FAIL':
                return <AlertCircle className="text-red-500" size={16} />;
            case 'NOT_APPLICABLE':
            default:
                return <Info className="text-gray-400" size={16} />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-dark-text">Document Fraud Check Results</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Verification Status</p>
                            <p className="text-2xl font-bold text-dark-text">{result.status || 'UNKNOWN'}</p>
                        </div>
                        {result.outcomes && result.outcomes.length > 0 && (
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-600">Authenticity Score</p>
                                <p className="text-2xl font-bold text-brand">{result.outcomes[0].score || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {result.outcomes && result.outcomes.length > 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-700">{result.outcomes[0].message}</p>
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-dark-text mb-4 mt-8">Detailed Check Results</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Check Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 w-1/2">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {result.checkResults && Object.entries(result.checkResults).map(([key, check]: [string, any]) => (
                                    <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark-text">{check.name || key}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(check.result?.status)}
                                                <span className={`font-semibold ${check.result?.status === 'PASS' ? 'text-green-600' :
                                                        check.result?.status === 'FAIL' ? 'text-red-600' : 'text-gray-500'
                                                    }`}>
                                                    {check.result?.status || 'UNKNOWN'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-xs">
                                            {check.result?.message || 'No additional details provided.'}
                                        </td>
                                    </tr>
                                ))}
                                {(!result.checkResults || Object.keys(result.checkResults).length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No detailed check results available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-brand bg-brand-light rounded-lg hover:bg-brand/20 transition-colors"
                    >
                        <Download size={16} />
                        Download JSON
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-dark transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
