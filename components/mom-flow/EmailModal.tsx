import React from 'react';
import { Button } from '../Button';
import { Mail } from 'lucide-react';

interface EmailModalProps {
    recipientEmail: string;
    setRecipientEmail: (email: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
    recipientEmail, setRecipientEmail,
    onCancel, onConfirm
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Send Report</h3>
                <p className="text-sm text-slate-600 mb-4">
                    We'll open your default email client. The professional HTML report will be copied to your clipboard automatically. Just paste it (Ctrl+V) into the email body.
                </p>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Recipient Email</label>
                    <input
                        type="email"
                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="supplier@company.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onConfirm} icon={<Mail size={14} />}>Open Mail Client</Button>
                </div>
            </div>
        </div>
    );
};
