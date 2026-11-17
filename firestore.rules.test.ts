/**
 * Security Rules Verification Spec ("Dirty Dozen" Payloads)
 * Maps each adversarial payload in security_spec.md to its expected Firestore rule enforcement.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid?: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
  enforcedByRule: string;
}

export const dirtyDozenSecurityCases: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Public Read of Draft Property',
    collection: 'properties',
    operation: 'get',
    auth: null,
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'existing().published == true || isAdmin()',
  },
  {
    id: 2,
    name: 'Public Inquiry List (PII Scraping)',
    collection: 'inquiries',
    operation: 'list',
    auth: { uid: 'visitor-1', email: 'visitor@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'allow read: if isAdmin()',
  },
  {
    id: 3,
    name: 'Inquiry Status Spoofing on Create',
    collection: 'inquiries',
    operation: 'create',
    auth: null,
    payload: { status: 'completed' },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: "data.status == 'new'",
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Inquiry',
    collection: 'inquiries',
    operation: 'create',
    auth: null,
    payload: { isAdminApproved: true },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'data.keys().hasOnly([...])',
  },
  {
    id: 5,
    name: 'Timestamp Spoofing on Inquiry',
    collection: 'inquiries',
    operation: 'create',
    auth: null,
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'data.createdAt == request.time',
  },
  {
    id: 6,
    name: 'Oversized Message DoW Attack',
    collection: 'inquiries',
    operation: 'create',
    auth: null,
    payload: { message: 'x'.repeat(5000) },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'data.message.size() <= 3000',
  },
  {
    id: 7,
    name: 'Unverified Email Admin Spoof',
    collection: 'properties',
    operation: 'create',
    auth: { uid: 'spoof-1', email: 'frankfufeng@gmail.com', email_verified: false },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'request.auth.token.email_verified == true',
  },
  {
    id: 8,
    name: 'Non-Admin CMS Tampering',
    collection: 'siteConfig',
    operation: 'update',
    auth: { uid: 'user-2', email: 'someone@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'allow create, update, delete: if isAdmin()',
  },
  {
    id: 9,
    name: 'ID Poisoning Attack',
    collection: 'inquiries',
    operation: 'create',
    auth: null,
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'isValidId(inquiryId)',
  },
  {
    id: 10,
    name: 'Array Overflow / Type Poisoning',
    collection: 'properties',
    operation: 'create',
    auth: { uid: 'admin-1', email: 'frankfufeng@gmail.com', email_verified: true },
    payload: { imageUrls: [123] },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'data.imageUrls.size() <= 15 && data.imageUrls[0] is string',
  },
  {
    id: 11,
    name: 'Immutable Timestamp Tampering',
    collection: 'properties',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'frankfufeng@gmail.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'incoming().createdAt == existing().createdAt',
  },
  {
    id: 12,
    name: 'Privilege Escalation on /admins',
    collection: 'admins',
    operation: 'create',
    auth: { uid: 'user-2', email: 'someone@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedByRule: 'allow create, update, delete: if isAdmin()',
  },
];
