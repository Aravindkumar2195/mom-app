export enum UserType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER'
}

export interface Participant {
  id: string;
  name: string;
  designation: string;
  email: string;
  type: UserType;
}

export interface Observation {
  id: string;
  category: string; // e.g., Quality, Safety, Production, General
  description: string;
  polishedDescription?: string;
  photoDataUrl?: string; // Base64 string
  status: 'OPEN' | 'CLOSED';
  targetDate?: string;
  responsibility?: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  location: string;
  contactPerson: string;
  email?: string;
}

export interface MeetingRecord {
  id: string;
  date: string; // ISO String
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  participants: Participant[];
  observations: Observation[];
  executiveSummary?: string;
  createdAt: number;
}

export type ViewState = 'DASHBOARD' | 'CREATE_MOM' | 'HISTORY';