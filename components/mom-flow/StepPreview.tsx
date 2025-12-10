import React, { useState } from 'react';
import { Button } from '../Button';
import { Check, FileDown, Send, Mail } from 'lucide-react';
import { Supplier, Participant, Observation, UserType, MeetingRecord } from '../../types';
import { EmailModal } from './EmailModal';

interface StepPreviewProps {
    initialData?: MeetingRecord | null;
    selectedSupplier: Supplier | null;
    date: string;
    executiveSummary: string;
    setExecutiveSummary: (summary: string) => void;
    participants: Participant[];
    observations: Observation[];
    loading: boolean;

    onEdit: () => void;
    onFinalize: () => void;
    handleExportPdf: () => void;
    handleCopyToClipboard: () => Promise<void>;

    handlePrepareSendToSupplier: () => void;
    recipientEmail: string;
    setRecipientEmail: (email: string) => void;
    showEmailModal: boolean;
    setShowEmailModal: (show: boolean) => void;
    handleConfirmSendEmail: () => void;
}

export const StepPreview: React.FC<StepPreviewProps> = ({
    initialData, selectedSupplier, date,
    executiveSummary, setExecutiveSummary,
    participants, observations,
    loading,
    onEdit, onFinalize,
    handleExportPdf, handleCopyToClipboard,
    handlePrepareSendToSupplier,
    recipientEmail, setRecipientEmail,
    showEmailModal, setShowEmailModal,
    handleConfirmSendEmail
}) => {
    return (
        <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">

            <div className="bg-white rounded-xl shadow-xl flex flex-col flex-1 overflow-hidden border border-slate-200">
                {/* Toolbar */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-700 pl-2">Report Preview</h2>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onEdit} className="text-sm">Edit</Button>
                        <Button variant="primary" icon={<Check size={16} />} onClick={onFinalize} className="bg-slate-800 hover:bg-slate-900">
                            {initialData ? 'Update Record' : 'Save Record'}
                        </Button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto bg-slate-100 p-6 md:p-10">
                    <div className="bg-white shadow-2xl mx-auto max-w-3xl min-h-[800px] relative">
                        {/* Paper Look */}
                        <div className="p-12">
                            <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 leading-none">Visit Report</h1>
                                    <div className="text-slate-500 mt-2 font-medium">Minutes of Meeting</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">{selectedSupplier?.name}</div>
                                    <div className="text-xs text-slate-500">{date}</div>
                                </div>
                            </div>

                            {/* Exec Summary Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-blue-100 pb-1">Executive Summary</h3>
                                {loading && !executiveSummary ? (
                                    <div className="h-20 bg-slate-50 animate-pulse rounded border border-slate-100"></div>
                                ) : (
                                    <textarea
                                        className="w-full bg-slate-50 border border-transparent hover:border-slate-200 rounded p-3 text-slate-700 resize-none focus:ring-1 focus:ring-blue-500 text-sm leading-relaxed"
                                        rows={4}
                                        value={executiveSummary}
                                        onChange={(e) => setExecutiveSummary(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Participants Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-blue-100 pb-1">Participants</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-semibold text-slate-400 text-xs mb-1">Customer Team</div>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {participants.filter(p => p.type === UserType.CUSTOMER).map(p => (
                                                <li key={p.id}>{p.name} <span className="text-slate-400 text-xs">({p.designation})</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-400 text-xs mb-1">Supplier Team</div>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {participants.filter(p => p.type === UserType.SUPPLIER).map(p => (
                                                <li key={p.id}>{p.name} <span className="text-slate-400 text-xs">({p.designation})</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Observations Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-4 border-b border-blue-100 pb-1">Detailed Observations</h3>
                                <div className="space-y-6">
                                    {observations.map((obs, idx) => (
                                        <div key={obs.id} className="flex gap-4 group">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{idx + 1}</div>
                                            <div className="flex-1 border-b border-slate-100 pb-4 last:border-0">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-sm text-slate-800">{obs.category}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${obs.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{obs.status}</span>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">{obs.polishedDescription || obs.description}</p>
                                                <div className="mt-2 flex gap-4 text-xs text-slate-500">
                                                    <span><strong className="text-slate-700">Resp:</strong> {obs.responsibility || 'N/A'}</span>
                                                    <span><strong className="text-slate-700">Target:</strong> {obs.targetDate || 'Immediate'}</span>
                                                </div>
                                                {obs.photoDataUrl && (
                                                    <img src={obs.photoDataUrl} className="mt-3 h-24 rounded border border-slate-200" alt="Evidence" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
                    <div className="text-sm text-slate-500 hidden md:block pl-2">
                        Choose distribution method:
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Button
                            variant="secondary"
                            icon={<FileDown size={16} />}
                            onClick={handleExportPdf}
                        >
                            Export PDF
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<Send size={16} />}
                            onClick={() => {
                                handleCopyToClipboard().then(() => {
                                    alert("Report copied to clipboard! \n\nPaste it directly into Outlook, Gmail, or Word.");
                                });
                            }}
                        >
                            Copy HTML
                        </Button>
                        <Button
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 shadow-sm"
                            icon={<Mail size={16} />}
                            onClick={handlePrepareSendToSupplier}
                        >
                            Send via Email
                        </Button>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <EmailModal
                    recipientEmail={recipientEmail}
                    setRecipientEmail={setRecipientEmail}
                    onCancel={() => setShowEmailModal(false)}
                    onConfirm={handleConfirmSendEmail}
                />
            )}
        </div>
    );
};
