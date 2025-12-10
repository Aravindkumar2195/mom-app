import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Supplier, Participant, UserType, Observation, MeetingRecord } from '../types';
import { getSuppliers, saveSupplier, saveMeetingRecord, compressImage } from '../services/storageService';
import { polishObservationText, generateExecutiveSummary } from '../services/geminiService';
import { generateMomPdf } from '../services/pdfService';
import { generateEmailHtml } from '../services/reportGenerator';
import { OBSERVATION_CATEGORIES } from '../constants';

// Sub-components
import { ProgressBar } from './mom-flow/ProgressBar';
import { StepDetails } from './mom-flow/StepDetails';
import { StepParticipants } from './mom-flow/StepParticipants';
import { StepObservations } from './mom-flow/StepObservations';
import { StepPreview } from './mom-flow/StepPreview';

interface CreateMomFlowProps {
  onComplete: () => void;
  initialData?: MeetingRecord | null;
}

export const CreateMomFlow: React.FC<CreateMomFlowProps> = ({ onComplete, initialData }) => {
  // --- State ---
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Data State
  const [existingSuppliers, setExistingSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isNewSupplier, setIsNewSupplier] = useState(false);
  const [newSupplierForm, setNewSupplierForm] = useState<Supplier>({
    id: '', name: '', code: '', location: '', contactPerson: '', email: ''
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Email Flow State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Initialize from initialData if present
  const [date, setDate] = useState<string>(initialData?.date || new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<Participant[]>(initialData?.participants || [
    { id: '1', name: '', designation: '', email: '', type: UserType.CUSTOMER },
    { id: '2', name: '', designation: '', email: '', type: UserType.SUPPLIER }
  ]);

  const [observations, setObservations] = useState<Observation[]>(initialData?.observations || []);
  const [executiveSummary, setExecutiveSummary] = useState(initialData?.executiveSummary || '');

  // Refs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // --- Effects ---
  useEffect(() => {
    const sups = getSuppliers();
    setExistingSuppliers(sups);

    if (initialData) {
      // Find and set the selected supplier
      const found = sups.find(s => s.id === initialData.supplierId);
      if (found) {
        setSelectedSupplier(found);
      } else {
        // Fallback if not found in list, reconstruct minimal supplier
        setSelectedSupplier({
          id: initialData.supplierId,
          name: initialData.supplierName,
          code: initialData.supplierCode,
          location: '',
          contactPerson: ''
        });
      }
    }
  }, [initialData]);

  // --- Handlers ---

  const handleSelectSupplier = (s: Supplier) => {
    setSelectedSupplier(s);
    setIsNewSupplier(false);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddNewSupplierStart = () => {
    setIsNewSupplier(true);
    setSelectedSupplier(null);
    setIsDropdownOpen(false);
    setNewSupplierForm(prev => ({ ...prev, name: searchTerm }));
  };

  const handleClearSelection = () => {
    setSelectedSupplier(null);
    setIsNewSupplier(false);
    setSearchTerm('');
  };

  const handleCreateSupplier = () => {
    if (!newSupplierForm.name || !newSupplierForm.code) return;
    const newSup: Supplier = { ...newSupplierForm, id: crypto.randomUUID() };
    saveSupplier(newSup);
    setExistingSuppliers(getSuppliers());
    setSelectedSupplier(newSup);
    setIsNewSupplier(false);
  };

  const addParticipant = (type: UserType) => {
    setParticipants([...participants, {
      id: crypto.randomUUID(),
      name: '',
      designation: '',
      email: '',
      type
    }]);
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const addObservation = () => {
    setObservations([...observations, {
      id: crypto.randomUUID(),
      category: OBSERVATION_CATEGORIES[0],
      description: '',
      status: 'OPEN',
      targetDate: '',
      responsibility: selectedSupplier?.contactPerson || 'Supplier'
    }]);
  };

  const updateObservation = (id: string, field: keyof Observation, value: string) => {
    setObservations(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handlePhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        const compressed = await compressImage(rawBase64, 800, 0.7);
        updateObservation(id, 'photoDataUrl', compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePolish = async (id: string, text: string) => {
    if (!text) return;
    setLoading(true);
    const polished = await polishObservationText(text);
    updateObservation(id, 'polishedDescription', polished);
    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const summary = await generateExecutiveSummary(observations, selectedSupplier?.name || '');
    setExecutiveSummary(summary);
    setLoading(false);
  };

  const handleFinalize = () => {
    if (!selectedSupplier) return;

    const record: MeetingRecord = {
      id: initialData?.id || crypto.randomUUID(),
      date,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierCode: selectedSupplier.code,
      participants,
      observations,
      executiveSummary,
      createdAt: initialData?.createdAt || Date.now()
    };

    saveMeetingRecord(record);
    onComplete();
  };

  const copyReportToClipboard = async () => {
    const html = generateEmailHtml(observations, participants, selectedSupplier, date, executiveSummary);
    const blob = new Blob([html], { type: 'text/html' });
    // Also create plain text version for fallbacks
    const text = `Visit Report for ${selectedSupplier?.name}\nDate: ${date}\n\nSummary:\n${executiveSummary}\n\n(See HTML attachment/paste for full table)`;
    const textBlob = new Blob([text], { type: 'text/plain' });

    try {
      const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })];
      await navigator.clipboard.write(data);
    } catch (err) {
      console.error("Clipboard API failed, falling back to basic copy", err);
      // Fallback or alert user
    }
  };

  const HandleCopyToClipboardWrapper = async () => { // Renamed to avoid collision/confusion if any, but mostly for consistency
    await copyReportToClipboard();
  };

  const handleExportPdf = () => {
    if (!selectedSupplier) return;
    // Construct temporary record object for PDF generation
    const record: MeetingRecord = {
      id: initialData?.id || 'temp',
      date,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierCode: selectedSupplier.code,
      participants,
      observations,
      executiveSummary,
      createdAt: Date.now()
    };
    generateMomPdf(record);
  };

  const handlePrepareSendToSupplier = () => {
    setRecipientEmail(selectedSupplier?.email || '');
    setShowEmailModal(true);
  };

  const handleConfirmSendEmail = async () => {
    // Save the email if it was updated/added
    if (selectedSupplier && recipientEmail && recipientEmail !== selectedSupplier.email) {
      const updatedSupplier = { ...selectedSupplier, email: recipientEmail };
      saveSupplier(updatedSupplier);
      setSelectedSupplier(updatedSupplier);
    }

    await copyReportToClipboard();

    const subject = encodeURIComponent(`Visit Report: ${selectedSupplier?.name} - ${date}`);
    const body = encodeURIComponent("Please find the visit report pasted below (or attached).\n\n[PASTE REPORT HERE]\n\nRegards,");

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    setShowEmailModal(false);
  };

  // --- Animations ---
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // --- Render Steps ---
  return (
    <div>
      <ProgressBar step={step} />

      <AnimatePresence mode='wait'>
        {step === 1 && (
          <motion.div
            key="step1"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StepDetails
              date={date} setDate={setDate}
              selectedSupplier={selectedSupplier}
              existingSuppliers={existingSuppliers}
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
              isNewSupplier={isNewSupplier}
              newSupplierForm={newSupplierForm} setNewSupplierForm={setNewSupplierForm}
              handleSelectSupplier={handleSelectSupplier}
              handleAddNewSupplierStart={handleAddNewSupplierStart}
              handleClearSelection={handleClearSelection}
              handleCreateSupplier={handleCreateSupplier}
              onNext={() => setStep(2)}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StepParticipants
              participants={participants}
              addParticipant={addParticipant}
              updateParticipant={updateParticipant}
              removeParticipant={removeParticipant}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StepObservations
              observations={observations}
              setObservations={setObservations}
              addObservation={addObservation}
              updateObservation={updateObservation}
              handlePhotoUpload={handlePhotoUpload}
              handlePolish={handlePolish}
              loading={loading}
              onBack={() => setStep(2)}
              onNext={() => { handleGenerateSummary(); setStep(4); }}
              fileInputRefs={fileInputRefs}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StepPreview
              initialData={initialData}
              selectedSupplier={selectedSupplier}
              date={date}
              executiveSummary={executiveSummary}
              setExecutiveSummary={setExecutiveSummary}
              participants={participants}
              observations={observations}
              loading={loading}
              onEdit={() => setStep(3)}
              onFinalize={handleFinalize}
              handleExportPdf={handleExportPdf}
              handleCopyToClipboard={HandleCopyToClipboardWrapper}
              handlePrepareSendToSupplier={handlePrepareSendToSupplier}
              recipientEmail={recipientEmail} setRecipientEmail={setRecipientEmail}
              showEmailModal={showEmailModal} setShowEmailModal={setShowEmailModal}
              handleConfirmSendEmail={handleConfirmSendEmail}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};