# Security Specification for Scripture Access Digital Hub

## 1. Data Invariants
- Only authorized admins (Root or Co-Admin) can modify project, equipment, report, and config data.
- Any user can view the public data (projects, reports, schedule, etc.).
- Admin requests can be created by any authenticated user but only readable/updatable by admins.
- The Root Admin (`taewan_yang@gbt.or.kr`) is the ultimate authority.
- Timestamps must be server-generated.
- Image URLs must be valid strings.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Unauthorized Update**: A guest user trying to update a project's progress.
2. **Self-Approval**: A user trying to set their own `AdminRequest` status to "approved".
3. **Admin List Poisoning**: A non-admin trying to write their UID into the `admins` collection.
4. **Invalid Schema**: Creating a project without a name.
5. **Ghost Field**: Adding `isAdmin: true` to a guest user's profile (if we had profiles).
6. **Bypassing Terminal State**: Changing a request that is already "rejected".
7. **Orphaned Write**: Creating a report with a non-existent category (though categories aren't external collections here).
8. **ID Poisoning**: Using a 1MB string as a project ID.
9. **Timestamp Spoofing**: Setting a future `createdAt` from the client.
10. **Data Scraping**: Trying to list all `admin_requests` without being an admin.
11. **Impersonation**: Setting `email` in a request to `taewan_yang@gbt.or.kr` when the auth email is different.
12. **Null PII**: Setting admin email to null.

## 3. Test Runner (Conceptual Overview)
We will verify that:
- `get(/databases/$(database)/documents/admins/$(request.auth.uid))` is used to verify admin status.
- `affectedKeys().hasOnly(...)` is used on all updates.
- `isValidProject`, `isValidReport`, etc., are used on writes.
