# Security Specification — Bruder BK Pastelería Peruana en BCN

## 1. Data Invariants
1. **Default Deny**: All unspecified Firestore paths are denied by default (`/{document=**}`).
2. **Public Catalog vs. Admin Governance**: `bakery_profile`, `products`, and `gallery_items` are publicly readable for storefront visitors, but ONLY verified admins (`request.auth.token.email_verified == true` and bootstrapped admin email or `/admins/{uid}`) can create, update, or delete them.
3. **PII & Inquiry Isolation**: `inquiries` and `users` contain customer PII (`customerEmail`, `customerName`, `email`). Blanket reads (`allow read: if isSignedIn()`) are prohibited. Every `get` and `list` on `inquiries` must enforce `resource.data.userId == request.auth.uid || isAdmin()`. Every `get` and `list` on `users` must enforce `userId == request.auth.uid || isAdmin()`.
4. **No Self-Assigned Privileges**: Users cannot write `role`, `isAdmin`, or any shadow privilege fields on `users/{userId}` or `admins/{userId}`.
5. **Terminal State Locking**: Once an inquiry reaches `status == 'respondida'`, non-admin users cannot edit or delete it. Non-admin users can only create inquiries with `status == 'pendiente'`.
6. **Temporal Integrity & Path Hardening**: All document IDs are validated via `isValidId()`, all strings enforce `.size()` limits matching `firebase-blueprint.json`, and `createdAt`/`updatedAt` strictly equal `request.time`.

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Inquiry Create**: Anonymous caller attempts to create `/inquiries/inq1` -> DENIED (`isSignedIn()` + `email_verified`).
2. **Identity Spoofing on Inquiry**: Authenticated user A sets `userId: "userB"` when creating `/inquiries/inq2` -> DENIED (`data.userId == request.auth.uid`).
3. **State Shortcutting on Inquiry Create**: Authenticated user creates `/inquiries/inq3` with `status: "respondida"` -> DENIED (`data.status == 'pendiente'`).
4. **Shadow Field Injection on User Profile**: User creates `/users/{uid}` with extra field `isAdmin: true` -> DENIED (`keys().hasOnly(...)`).
5. **Unverified Email Spoofing**: Caller with `email == 'flowcraftmediauk@gmail.com'` and `email_verified == false` attempts to update `/products/tortas` -> DENIED (`email_verified == true`).
6. **Cross-User Inquiry Read**: Authenticated user A calls `get(/inquiries/userB_inq)` -> DENIED (`resource.data.userId == request.auth.uid || isAdmin()`).
7. **Unfiltered Inquiry List Scrape**: Authenticated non-admin user runs `list` on `/inquiries` without `where('userId', '==', uid)` -> DENIED by query enforcer.
8. **ID Poisoning Attack**: Caller writes to `/inquiries/invalid$id!with*badchars` or >128 char ID -> DENIED (`isValidId()`).
9. **Denial of Wallet Giant String**: Authenticated user submits `message` with 10,000 characters on `/inquiries/inq4` -> DENIED (`message.size() <= 2000`).
10. **Non-Admin Product Tampering**: Authenticated regular customer attempts to update `/products/tortas` or `/bakery_profile/bruder_bk` -> DENIED (`isAdmin()`).
11. **Terminal State Bypass**: Authenticated customer attempts to modify `/inquiries/inq5` after admin marked `status == 'respondida'` -> DENIED (`existing().status == 'pendiente'`).
12. **Client Timestamp Forgery**: Authenticated user sets `createdAt` to a backdated timestamp instead of `request.time` -> DENIED (`data.createdAt == request.time`).
