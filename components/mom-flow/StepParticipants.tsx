import React from 'react';
import { Participant, UserType } from '../../types';
import { Button } from '../Button';
import { Trash2, UserPlus, ChevronRight } from 'lucide-react';

interface StepParticipantsProps {
    participants: Participant[];
    addParticipant: (type: UserType) => void;
    updateParticipant: (id: string, field: keyof Participant, value: string) => void;
    removeParticipant: (id: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export const StepParticipants: React.FC<StepParticipantsProps> = ({
    participants,
    addParticipant,
    updateParticipant,
    removeParticipant,
    onBack,
    onNext
}) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Meeting Participants</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Customer Side */}
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                            <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
                            Customer Team
                            <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-semibold">INTERNAL</span>
                        </h3>
                        <div className="space-y-3">
                            {participants.filter(p => p.type === UserType.CUSTOMER).map(p => (
                                <div key={p.id} className="flex gap-2 items-center bg-white p-2 rounded shadow-sm border border-blue-100">
                                    <div className="flex-1 space-y-1">
                                        <input
                                            placeholder="Name"
                                            className="w-full p-1.5 text-sm border-none bg-transparent focus:ring-0 font-medium placeholder-slate-400"
                                            value={p.name}
                                            onChange={e => updateParticipant(p.id, 'name', e.target.value)}
                                        />
                                        <div className="h-px bg-slate-100"></div>
                                        <input
                                            placeholder="Designation"
                                            className="w-full p-1.5 text-xs border-none bg-transparent focus:ring-0 text-slate-500 placeholder-slate-300"
                                            value={p.designation}
                                            onChange={e => updateParticipant(p.id, 'designation', e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => removeParticipant(p.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addParticipant(UserType.CUSTOMER)} className="w-full text-sm border-dashed border-blue-300 text-blue-600 hover:bg-blue-50">
                                <UserPlus size={16} className="mr-2" /> Add Member
                            </Button>
                        </div>
                    </div>

                    {/* Supplier Side */}
                    <div className="bg-green-50/50 p-5 rounded-xl border border-green-100">
                        <h3 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                            <span className="w-2 h-6 bg-green-600 rounded mr-2"></span>
                            Supplier Team
                            <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-semibold">EXTERNAL</span>
                        </h3>
                        <div className="space-y-3">
                            {participants.filter(p => p.type === UserType.SUPPLIER).map(p => (
                                <div key={p.id} className="flex gap-2 items-center bg-white p-2 rounded shadow-sm border border-green-100">
                                    <div className="flex-1 space-y-1">
                                        <input
                                            placeholder="Name"
                                            className="w-full p-1.5 text-sm border-none bg-transparent focus:ring-0 font-medium placeholder-slate-400"
                                            value={p.name}
                                            onChange={e => updateParticipant(p.id, 'name', e.target.value)}
                                        />
                                        <div className="h-px bg-slate-100"></div>
                                        <input
                                            placeholder="Designation"
                                            className="w-full p-1.5 text-xs border-none bg-transparent focus:ring-0 text-slate-500 placeholder-slate-300"
                                            value={p.designation}
                                            onChange={e => updateParticipant(p.id, 'designation', e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => removeParticipant(p.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addParticipant(UserType.SUPPLIER)} className="w-full text-sm border-dashed border-green-300 text-green-600 hover:bg-green-50">
                                <UserPlus size={16} className="mr-2" /> Add Member
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-between">
                    <Button variant="ghost" onClick={onBack}>Back</Button>
                    <Button onClick={onNext} className="px-8" icon={<ChevronRight size={18} />}>Next: Observations</Button>
                </div>
            </div>
        </div>
    );
};
