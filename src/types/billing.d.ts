export type UserRole = 'admin' | 'BCBA' | 'RBT' | 'client' | 'parent' | 'user';

export interface BillingCode {
  id: string;
  code: string;
  description: string;
  billingUnit: 'minute' | '15-min' | 'hour' | 'day' | 'session' | 'unit';
  defaultRate?: number;
  defaultUnits?: number;
}

export interface BillingModifier {
  id: string;
  code: string;
  description: string;
  applicableRoles: UserRole[];
}

export interface BillingSession {
  id: string;
  sessionId: string;
  codeId: string;
  modifiers: string[];
  units: number;
  rate?: number;
  totalAmount?: number;
  status: 'draft' | 'pending' | 'submitted' | 'paid' | 'rejected';
  submittedAt?: string;
  paidAt?: string;
}
