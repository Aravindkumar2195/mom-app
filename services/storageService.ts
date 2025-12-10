import { MeetingRecord, Supplier } from '../types';
import { supabase } from './supabase';

// Helper to get current user ID
const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
};

// --- Suppliers ---

export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
  return data || [];
};

export const saveSupplier = async (supplier: Supplier): Promise<void> => {
  const user_id = await getUserId();

  // Check if exists to determine update vs insert (though we could use upsert)
  // For simplicity using upsert but we need to ensure the ID matches

  const { error } = await supabase
    .from('suppliers')
    .upsert({
      id: supplier.id,
      name: supplier.name,
      code: supplier.code,
      location: supplier.location,
      contact_person: supplier.contactPerson, // DB column name snake_case
      email: supplier.email,
      user_id // RLS Policy ensures users only see their own
    });

  if (error) console.error('Error saving supplier:', error);
};

// --- Meeting Records ---

export const getMeetingRecords = async (): Promise<MeetingRecord[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching records:', error);
    return [];
  }

  // Transform snake_case DB columns back to camelCase types if needed, 
  // or Supabase JS client can handle this if setup types correctly.
  // Assuming basic mapping here for now:
  return (data || []).map((row: any) => ({
    ...row,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    supplierCode: row.supplier_code,
    executiveSummary: row.executive_summary,
    createdAt: new Date(row.created_at).getTime()
  }));
};

export const saveMeetingRecord = async (record: MeetingRecord): Promise<void> => {
  const user_id = await getUserId();

  const payload = {
    id: record.id,
    date: record.date,
    supplier_id: record.supplierId,
    supplier_name: record.supplierName,
    supplier_code: record.supplierCode,
    participants: record.participants, // stored as jsonb
    observations: record.observations, // stored as jsonb
    executive_summary: record.executiveSummary,
    created_at: new Date(record.createdAt).toISOString(),
    user_id
  };

  const { error } = await supabase
    .from('meetings')
    .upsert(payload);

  if (error) console.error('Error saving record:', error);
};

export const compressImage = (base64: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      if (ratio >= 1) {
        resolve(base64); // No resize needed
        return;
      }
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
  });
};