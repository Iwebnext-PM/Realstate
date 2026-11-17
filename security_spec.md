# Security Specification — Frank Fu Feng Real Estate

## 1. Data Invariants
1. **Unpublished Listings Stay Private**: Any `/properties/{propertyId}` or `/testimonials/{testimonialId}` document with `published != true` MUST only be readable by verified administrators (`isAdmin()`).
2. **PII Isolation on Leads/Inquiries**: `/inquiries/{inquiryId}` contains visitor PII (`name`, `email`, `phone`, `message`). Public visitors may only `create` an inquiry with `status == 'new'` and server-validated timestamps (`request.time`); they can never `get`, `list`, `update`, or `delete` any inquiry.
3. **Verified Admin Authentication**: Admin privileges require `request.auth != null && request.auth.token.email_verified == true` and either a bootstrapped verified admin email or membership in `/admins/{uid}`.
4. **Strict Payload Keys & Bounds**: Every write validates `keys().hasAll(...)` and `keys().hasOnly(...)`, type checks, array size caps, and string length limits matching `firebase-blueprint.json`.
5. **Temporal Integrity & Immutability**: `createdAt` must equal `request.time` on creation and remain immutable on updates; `updatedAt` must equal `request.time` on both create and update.
6. **ID Poisoning Guard**: Every single-document `get`, `create`, `update`, and `delete` enforces `isValidId(docId)` (`^[a-zA-Z0-9_-]+$`, max 128 chars).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Public Read of Draft Property**: Unauthenticated user queries `/properties` where `published == false` -> `PERMISSION_DENIED`.
2. **Public Inquiry Listing (PII Scraping)**: Unauthenticated or non-admin signed-in user attempts `list` or `get` on `/inquiries` -> `PERMISSION_DENIED`.
3. **Inquiry Status Spoofing on Create**: Visitor submits an inquiry with `status: "completed"` instead of `"new"` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection on Inquiry**: Visitor submits an inquiry with an extra ghost field `{ isAdminApproved: true }` -> `PERMISSION_DENIED`.
5. **Timestamp Spoofing on Inquiry**: Visitor submits `createdAt: new Date("2020-01-01")` instead of `serverTimestamp()` -> `PERMISSION_DENIED`.
6. **Oversized Message DoW Attack**: Visitor submits a 50,000-character message string on `/inquiries` -> `PERMISSION_DENIED`.
7. **Unverified Email Admin Spoof**: Attacker signs in with `email_verified: false` matching an admin email and attempts to write `/properties` -> `PERMISSION_DENIED`.
8. **Non-Admin CMS Tampering**: Signed-in non-admin user tries to update `/siteConfig/general` -> `PERMISSION_DENIED`.
9. **ID Poisoning Attack**: Attacker tries `create` on `/inquiries/../../admins/bad` or 500-char doc ID -> `PERMISSION_DENIED`.
10. **Array Overflow / Type Poisoning**: Admin payload attempts to pass 100 image URLs or non-string element `[123]` in `imageUrls` -> `PERMISSION_DENIED`.
11. **Immutable Timestamp Tampering**: Update on `/properties/{id}` attempts to mutate `createdAt` -> `PERMISSION_DENIED`.
12. **Privilege Escalation on `/admins`**: Non-admin signed-in user attempts to write `/admins/{theirUid}` -> `PERMISSION_DENIED`.
