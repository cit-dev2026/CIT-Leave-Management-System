# CIT Leave Management System - Phase 1 Development Guide

## Database Seeding Instructions

### Overview
Phase 1 infrastructure is complete and ready for seeding development data. The seed script prepares:
- Companies, departments, branches, locations
- Job titles, grades, pay scales
- Leave types, employment types, employee statuses
- Employees with salary records and leave balances
- Public holidays

### Prerequisites

1. **Get the Service Role Key from Supabase:**
   - Go to: https://app.supabase.com/project/szqlrclavwrxcjkwbasd/settings/api
   - Find the "service_role" key (NOT the anon key)
   - Copy it

2. **Add to .env:**
   ```bash
   SUPABASE_SERVICE_KEY=<your-service-role-key-here>
   ```

3. **Run the seed script:**
   ```bash
   npm run seed
   ```

### What Gets Seeded

- **2 Companies:** CIT Global Solutions, CIT Technologies Division
- **5 Departments:** HR, IT, Sales, Operations, Development
- **3 Branches:** Singapore HQ, Malaysia, Bangalore
- **4 Locations:** Singapore L1, Singapore L2, KL, Bangalore
- **9 Job Titles:** CEO, HR Head, Manager, Software Engineer, Sales, Finance
- **6 Grades:** E1-E1 (Executive) to J1 (Junior)
- **4 Shifts:** Standard, Early, Late, Night
- **5 Leave Types:** Annual, Sick, Emergency, Unpaid, Maternity
- **4 Employees:** Test employees across departments
- **Leave Balances:** Pre-configured for testing

### Post-Seed Verification

After running the seed script:

```bash
# Verify companies were created
curl -s "https://szqlrclavwrxcjkwbasd.supabase.co/rest/v1/companies?select=*" \
  -H "Authorization: Bearer sb_publishable_h04ZSket9i2g9H2UOEME1A_PEds4g7k" | jq .
```

### Phase 1 Tasks Completed

✅ **Task 1-3:** Environment & connection setup  
✅ **Task 4-6:** Database operations verified (reads working, RLS enabled)  
✅ **Task 7:** Reusable service layer with CRUD abstractions  
✅ **Task 8:** React hooks for queries, mutations, loading states  
✅ **Task 9:** Loading state management (Idle/Loading/Success/Error)  
✅ **Task 10:** Global error handling context  
✅ **Task 11:** Toast notification system  
✅ **Task 12:** Full TypeScript type coverage (30+ tables)  
⏳ **Task 13:** Seed development data (awaiting service key)  

### Architecture Summary

#### Service Layer (`src/services/base-service.ts`)
- Generic CRUD: `queryTable()`, `insertIntoTable()`, `updateInTable()`, `deleteFromTable()`, `getById()`
- Standardized error handling
- Support for filtering, ordering, pagination

#### React Hooks (`src/hooks/use-supabase.ts`)
- `useSupabaseQuery()` - for SELECT operations
- `useSupabaseGetById()` - for single record fetches
- `useSupabaseInsert()` - for CREATE operations
- `useSupabaseUpdate()` - for UPDATE operations
- `useSupabaseDelete()` - for DELETE operations
- LoadingState enum for UI state management

#### Global Contexts
- **Error Context** (`src/contexts/error-context.tsx`) - Centralized error logging and user messaging
- **Toast Context** (`src/contexts/toast-context.tsx`) - Temporary notifications (success/error/warning/info)
- Integrated in `src/providers/app-providers.tsx`

### Next Steps (Phase 2)

1. Complete Phase 1 by seeding development data
2. Build Authentication module
3. Build Employee Management module
4. Build Leave Management module
5. Build Attendance tracking
6. Build Dashboard with KPIs

### Type Safety

All database operations use the `Database` type interface from `src/types/database.ts`, which provides:
- Type-safe row selection
- Insert/Update input validation
- Full table relationship mapping

Example:
```typescript
// Fully typed operation
const result = await queryTable('companies', {
  limit: 10,
  orderBy: 'created_at',
  filters: { is_active: true },
})
```

### Development Mode Notes

- **RLS is enabled:** All write operations require proper authentication
- **Row-Level Security:** Protects data integrity
- **Audit Logging:** All changes are logged automatically
- **Soft Deletes:** Employees marked as deleted, not actually removed

## Questions or Issues?

If you encounter problems with the seed script:
1. Verify SUPABASE_SERVICE_KEY is set correctly
2. Check that the key is the "service_role" key, not "anon"
3. Ensure your IP is allowed in Supabase firewall (if configured)
4. Contact your database administrator for access
