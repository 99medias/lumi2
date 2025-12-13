export interface LeakCheckEntry {
  source: string;
  breachDate: string | null;
  email: string | null;
  password: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  dob: string | null;
  fields: string[];
}

export interface LeakCheckResult {
  success: boolean;
  found: number;
  quota: number;
  entries: LeakCheckEntry[];
  fields: string[];
  passwordCount: number;
  hasPasswords: boolean;
  error?: string;
}
