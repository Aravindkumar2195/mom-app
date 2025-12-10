import React, { Dispatch, SetStateAction } from 'react';
import { Supplier } from '../../types';
import { Button } from '../Button';
import { Plus, Search, X, ChevronRight } from 'lucide-react';

interface StepDetailsProps {
    date: string;
    setDate: (date: string) => void;
    selectedSupplier: Supplier | null;
    existingSuppliers: Supplier[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    isNewSupplier: boolean;
    newSupplierForm: Supplier;
    setNewSupplierForm: Dispatch<SetStateAction<Supplier>>;

    handleSelectSupplier: (s: Supplier) => void;
    handleAddNewSupplierStart: () => void;
    handleClearSelection: () => void;
    handleCreateSupplier: () => void;
    onNext: () => void;
}

export const StepDetails: React.FC<StepDetailsProps> = ({
    date, setDate,
    selectedSupplier, existingSuppliers,
    searchTerm, setSearchTerm,
    isDropdownOpen, setIsDropdownOpen,
    isNewSupplier,
    newSupplierForm, setNewSupplierForm,
    handleSelectSupplier, handleAddNewSupplierStart, handleClearSelection, handleCreateSupplier,
    onNext
}) => {

    const filteredSuppliers = existingSuppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Visit Details</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Visit</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-slate-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Supplier</label>

                        {selectedSupplier && !isNewSupplier ? (
                            <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg animate-fade-in">
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">{selectedSupplier.name}</div>
                                    <div className="text-sm text-slate-500">{selectedSupplier.code} | {selectedSupplier.location}</div>
                                </div>
                                <button
                                    onClick={handleClearSelection}
                                    className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                    title="Change Supplier"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : isNewSupplier ? (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Creating New Supplier</span>
                                <button onClick={handleClearSelection} className="text-blue-600 text-sm hover:underline font-medium">Cancel</button>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Search Input */}
                                <div className="relative z-20">
                                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-base"
                                        placeholder="Search by Name or Code..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                    />
                                </div>

                                {/* Dropdown Overlay */}
                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                            {filteredSuppliers.length > 0 ? (
                                                filteredSuppliers.map(s => (
                                                    <div
                                                        key={s.id}
                                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 group transition-colors"
                                                        onClick={() => handleSelectSupplier(s)}
                                                    >
                                                        <div className="font-medium text-slate-800 group-hover:text-blue-700">{s.name}</div>
                                                        <div className="text-xs text-slate-500">{s.code} • {s.location}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-sm text-slate-500 text-center">No matches found</div>
                                            )}

                                            <div
                                                className="p-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue-700 font-semibold text-sm flex items-center justify-center border-t border-blue-100 sticky bottom-0 transition-colors"
                                                onClick={handleAddNewSupplierStart}
                                            >
                                                <Plus size={16} className="mr-2" /> Create "{searchTerm || 'New Supplier'}"
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {isNewSupplier && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 animate-fade-in shadow-inner">
                            <h3 className="font-semibold text-slate-800 border-b pb-2 mb-2">New Supplier Profile</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <input
                                        placeholder="Supplier Name"
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newSupplierForm.name}
                                        onChange={e => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })}
                                    />
                                </div>
                                <input
                                    placeholder="Supplier Code (e.g. S-123)"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSupplierForm.code}
                                    onChange={e => setNewSupplierForm({ ...newSupplierForm, code: e.target.value })}
                                />
                                <input
                                    placeholder="Location (City, Country)"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSupplierForm.location}
                                    onChange={e => setNewSupplierForm({ ...newSupplierForm, location: e.target.value })}
                                />
                                <input
                                    placeholder="Contact Person"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSupplierForm.contactPerson}
                                    onChange={e => setNewSupplierForm({ ...newSupplierForm, contactPerson: e.target.value })}
                                />
                                <input
                                    placeholder="Email Address"
                                    type="email"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSupplierForm.email || ''}
                                    onChange={e => setNewSupplierForm({ ...newSupplierForm, email: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleCreateSupplier} disabled={!newSupplierForm.name}>Create & Select</Button>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 flex justify-end">
                        <Button onClick={onNext} disabled={!selectedSupplier} className="w-full sm:w-auto px-8" icon={<ChevronRight size={18} />}>
                            Next Step
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
