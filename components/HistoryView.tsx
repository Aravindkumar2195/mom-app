import React, { useState, useEffect } from 'react';
import { MeetingRecord, Supplier } from '../types';
import { getMeetingRecords, getSuppliers } from '../services/storageService';
import { generateMomPdf } from '../services/pdfService';
import { Calendar, Users, FileText, ChevronRight, Pencil, FileDown, Briefcase, BarChart2, Filter, Check } from 'lucide-react';
import { Button } from './Button';

interface HistoryViewProps {
  onEdit: (record: MeetingRecord) => void;
}

type ViewMode = 'TIMELINE' | 'SUPPLIERS';

export const HistoryView: React.FC<HistoryViewProps> = ({ onEdit }) => {
  const [records, setRecords] = useState<MeetingRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('TIMELINE');
  const [selectedRecord, setSelectedRecord] = useState<MeetingRecord | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const [r, s] = await Promise.all([getMeetingRecords(), getSuppliers()]);
      setRecords(r);
      setSuppliers(s);
    };
    fetchRecords();
  }, []);

  // Filter records based on active view logic
  const displayedRecords = selectedSupplierId
    ? records.filter(r => r.supplierId === selectedSupplierId)
    : records;

  // Compute supplier stats
  const supplierStats = suppliers.map(s => {
    const sRecords = records.filter(r => r.supplierId === s.id);
    const totalOpen = sRecords.reduce((acc, r) => acc + r.observations.filter(o => o.status === 'OPEN').length, 0);
    return {
      ...s,
      visitCount: sRecords.length,
      lastVisit: sRecords.length > 0 ? sRecords[0].date : 'Never',
      openPoints: totalOpen
    };
  }).filter(s => s.visitCount > 0 || viewMode === 'SUPPLIERS'); // Show all in supplier mode, only active in stats? No show all.

  if (selectedRecord) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 max-w-4xl mx-auto p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setSelectedRecord(null)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
            <ChevronRight className="rotate-180 mr-1 w-4 h-4" /> Back to {selectedSupplierId ? 'Supplier' : 'History'}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => generateMomPdf(selectedRecord)} icon={<FileDown size={14} />} className="text-xs px-3">
              PDF
            </Button>
            <Button variant="secondary" onClick={() => onEdit(selectedRecord)} icon={<Pencil size={14} />} className="text-xs px-3">
              Edit
            </Button>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-6 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">{selectedRecord.supplierName}</h1>
            <div className="flex items-center text-slate-500 text-sm gap-3">
              <span className="flex items-center"><Calendar size={14} className="mr-1" /> {selectedRecord.date}</span>
              <span className="text-slate-300">|</span>
              <span>{selectedRecord.supplierCode}</span>
            </div>
          </div>
          <div className="bg-slate-50 px-3 py-1 rounded text-xs text-slate-400 font-mono">ID: {selectedRecord.id.slice(0, 8)}</div>
        </div>

        {selectedRecord.executiveSummary && (
          <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-600">
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-700 mb-2">Executive Summary</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{selectedRecord.executiveSummary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center">
              <FileText size={18} className="mr-2 text-slate-400" /> Observations
            </h3>
            <div className="space-y-4">
              {selectedRecord.observations.map((obs, i) => (
                <div key={obs.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex gap-3">
                    <div className="font-bold text-slate-300 text-sm pt-0.5">#{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase text-blue-600 tracking-wide">{obs.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${obs.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{obs.status}</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{obs.polishedDescription || obs.description}</p>
                      {obs.photoDataUrl && (
                        <img src={obs.photoDataUrl} className="mt-3 h-24 rounded border border-slate-200 shadow-sm" alt="evidence" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center">
              <Users size={18} className="mr-2 text-slate-400" /> Attendees
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <ul className="space-y-3">
                {selectedRecord.participants.map(p => (
                  <li key={p.id} className="text-sm">
                    <div className="font-medium text-slate-700">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.designation}</div>
                    <div className={`text-[10px] mt-0.5 inline-block px-1.5 rounded ${p.type === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {p.type}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Supplier List View ---
  if (viewMode === 'SUPPLIERS' && !selectedSupplierId) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Supplier Directory</h2>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('TIMELINE')}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-all text-slate-500 hover:bg-slate-50"
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('SUPPLIERS')}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-blue-600 text-white shadow"
            >
              Suppliers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplierStats.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedSupplierId(s.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Briefcase size={20} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">{s.visitCount}</div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Visits</div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-1 truncate">{s.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{s.code} | {s.location}</p>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
                <div className="text-slate-500">Last: <span className="font-medium text-slate-700">{s.lastVisit}</span></div>
                {s.openPoints > 0 ? (
                  <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold text-xs">{s.openPoints} Open Pts</span>
                ) : (
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold text-xs">All Closed</span>
                )}
              </div>
            </div>
          ))}
          {supplierStats.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              No suppliers found. Start a new visit to create one.
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Record List View (Timeline or Single Supplier) ---
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {selectedSupplierId && (
            <button onClick={() => setSelectedSupplierId(null)} className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50">
              <ChevronRight className="rotate-180 w-4 h-4 text-slate-600" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedSupplierId ? supplierStats.find(s => s.id === selectedSupplierId)?.name : 'Visit History'}
            </h2>
            <p className="text-slate-500 text-sm">
              {selectedSupplierId ? 'Detailed records for this supplier' : 'Chronological list of all visits'}
            </p>
          </div>
        </div>

        {!selectedSupplierId && (
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('TIMELINE')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'TIMELINE' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('SUPPLIERS')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'SUPPLIERS' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Suppliers
            </button>
          </div>
        )}
      </div>

      {displayedRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No records found</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">There are no meeting minutes recorded yet for this selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRecords.map(r => {
            const openCount = r.observations.filter(o => o.status === 'OPEN').length;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 flex flex-col md:flex-row md:items-center justify-between group relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${openCount > 0 ? 'bg-orange-400' : 'bg-green-500'}`}></div>

                <div className="flex items-center gap-6 pl-3">
                  <div className="text-center min-w-[4rem]">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Date</div>
                    <span className="text-sm font-bold text-slate-700 whitespace-nowrap bg-slate-50 px-2 py-1 rounded border border-slate-100">{r.date}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{r.supplierName}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center"><Users size={14} className="mr-1.5 text-slate-400" /> {r.participants.length} Attendees</span>
                      <span className="flex items-center"><FileText size={14} className="mr-1.5 text-slate-400" /> {r.observations.length} Observations</span>
                      <span className="bg-slate-50 px-1.5 rounded text-slate-400">{r.supplierCode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0 pl-3 md:pl-0">
                  <div className="text-right mr-4">
                    {openCount > 0 ? (
                      <div className="text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">{openCount} Open Issues</div>
                    ) : (
                      <div className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full flex items-center"><Check size={12} className="mr-1" /> All Closed</div>
                    )}
                  </div>
                  <div className="hidden md:flex bg-slate-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};