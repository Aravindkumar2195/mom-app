import React, { MutableRefObject } from 'react';
import { Observation } from '../../types';
import { OBSERVATION_CATEGORIES } from '../../constants';
import { Button } from '../Button';
import { Plus, Trash2, Wand2, Camera, Check, X } from 'lucide-react';

interface StepObservationsProps {
    observations: Observation[];
    setObservations: (obs: Observation[]) => void;
    addObservation: () => void;
    updateObservation: (id: string, field: keyof Observation, value: string) => void;
    handlePhotoUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePolish: (id: string, text: string) => void;
    loading: boolean;
    onBack: () => void;
    onNext: () => void;
    fileInputRefs: MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

export const StepObservations: React.FC<StepObservationsProps> = ({
    observations, setObservations,
    addObservation, updateObservation,
    handlePhotoUpload, handlePolish,
    loading,
    onBack, onNext,
    fileInputRefs
}) => {

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Observations</h2>
                        <p className="text-slate-500 text-sm">Record findings, non-conformities, and improvements.</p>
                    </div>
                    <Button onClick={addObservation} icon={<Plus size={18} />} className="shadow-md">Add Point</Button>
                </div>

                <div className="space-y-6">
                    {observations.length === 0 && (
                        <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                            <div className="text-slate-400 mb-2">No observations recorded yet</div>
                            <Button variant="ghost" onClick={addObservation}>Click to add your first point</Button>
                        </div>
                    )}

                    {observations.map((obs, index) => (
                        <div key={obs.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-5 left-0 w-1 h-12 bg-blue-500 rounded-r"></div>
                            <div className="flex justify-between items-start mb-4 pl-3">
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Point #{index + 1}</span>
                                <button onClick={() => setObservations(observations.filter(o => o.id !== obs.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pl-3">
                                {/* Category Selection */}
                                <div className="md:col-span-3 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                                        <select
                                            className="w-full border-slate-200 rounded-md text-sm p-2 bg-slate-50 focus:bg-white transition-colors"
                                            value={obs.category}
                                            onChange={e => updateObservation(obs.id, 'category', e.target.value)}
                                        >
                                            {OBSERVATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                                        <select
                                            className={`w-full border rounded-md text-sm p-2 font-bold ${obs.status === 'OPEN' ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100'}`}
                                            value={obs.status}
                                            onChange={e => updateObservation(obs.id, 'status', e.target.value as any)}
                                        >
                                            <option value="OPEN">OPEN (Action Required)</option>
                                            <option value="CLOSED">CLOSED (Compliant)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Main Description */}
                                <div className="md:col-span-6 space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Observation Details</label>
                                        <textarea
                                            className="w-full border-slate-200 rounded-lg text-sm p-3 h-28 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                            placeholder="Describe the issue or finding..."
                                            value={obs.description}
                                            onChange={e => updateObservation(obs.id, 'description', e.target.value)}
                                        />
                                    </div>

                                    {/* Polished Version Preview */}
                                    {obs.polishedDescription && (
                                        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm text-indigo-900 animate-fade-in relative group/polish">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
                                                <Wand2 size={12} /> AI Improved
                                            </div>
                                            {obs.polishedDescription}
                                            <button
                                                className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-600 opacity-0 group-hover/polish:opacity-100 transition-opacity"
                                                onClick={() => updateObservation(obs.id, 'polishedDescription', '')}
                                                title="Remove AI Polish"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-3 items-center">
                                        <Button
                                            variant="secondary"
                                            className="text-xs py-1.5 px-3 h-auto"
                                            onClick={() => handlePolish(obs.id, obs.description)}
                                            isLoading={loading}
                                            disabled={!obs.description}
                                        >
                                            <Wand2 size={12} className="mr-1.5" /> AI Polish
                                        </Button>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment" // Forces rear camera on mobile
                                                className="hidden"
                                                ref={(el) => { fileInputRefs.current[obs.id] = el; }}
                                                onChange={(e) => handlePhotoUpload(obs.id, e)}
                                            />
                                            <Button
                                                variant={obs.photoDataUrl ? "primary" : "secondary"}
                                                className="text-xs py-1.5 px-3 h-auto"
                                                onClick={() => fileInputRefs.current[obs.id]?.click()}
                                            >
                                                <Camera size={12} className="mr-1.5" /> {obs.photoDataUrl ? 'Retake Photo' : 'Add Photo'}
                                            </Button>
                                        </div>
                                    </div>

                                    {obs.photoDataUrl && (
                                        <div className="mt-2 relative inline-block group/img">
                                            <img src={obs.photoDataUrl} alt="Evidence" className="h-24 w-auto rounded-lg border border-slate-200 shadow-sm" />
                                            <div className="absolute inset-0 bg-black/20 rounded-lg hidden group-hover/img:flex items-center justify-center">
                                                <button onClick={() => updateObservation(obs.id, 'photoDataUrl', '')} className="bg-red-500 text-white p-1 rounded-full"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="md:col-span-3 space-y-4 border-l border-slate-100 pl-4 md:pl-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Date</label>
                                        <input
                                            type="date"
                                            className="w-full border-slate-200 rounded-md text-sm p-2 text-slate-700"
                                            value={obs.targetDate}
                                            onChange={e => updateObservation(obs.id, 'targetDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Responsibility</label>
                                        <input
                                            placeholder="Person Name"
                                            className="w-full border-slate-200 rounded-md text-sm p-2 text-slate-700"
                                            value={obs.responsibility}
                                            onChange={e => updateObservation(obs.id, 'responsibility', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 flex justify-between">
                    <Button variant="ghost" onClick={onBack}>Back</Button>
                    <Button onClick={onNext} disabled={observations.length === 0} className="px-8" icon={<Check size={18} />}>
                        Generate Report
                    </Button>
                </div>
            </div>
        </div>
    );
};
