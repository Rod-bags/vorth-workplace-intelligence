# System Architecture & Technical Design Document

## 1. Executive Summary & Design Overview
Vorth Workplace Intelligence is designed as an enterprise-grade workforce management platform combining task distribution, real-time analytics, and secure anonymous feedback submission. 

The architecture is built on the **Next.js App Router** framework, taking advantage of Server Components, Client Components, Server Actions, and Middleware protection. It connects seamlessly to **Supabase** (PostgreSQL) for relational data persistence, authentication, and Row Level Security (RLS).

---

## 2. Core Architecture & Component Hierarchy

### System Flow Diagram
1. **Client Layer:** Next.js (React 18/19, Tailwind CSS, Recharts, Sonner, Next-Themes).
2. **Security & Middleware Layer:** Route guarding via Next.js Middleware checking Supabase JWT session tokens and user roles (`admin` vs. `employee`).
3. **Database Layer:** Supabase PostgreSQL database enforcing strict Row Level Security (RLS) policies at the table level.

### Key Directory Layout
- `app/(auth)/`: Unprotected authentication routes (login, registration, password recovery).
- `app/admin/`: Admin-only views (workforce tasks, employee profiles, feedback reviewing, Recharts analytics).
- `app/employee/`: Employee-restricted views (task completion tracking, anonymous feedback form).
- `app/api/ai/`: Isolated API routes handling server-side AI processing and feedback analysis.
- `components/`: Modular UI widgets (`navbar.tsx`, `theme-toggle.tsx`, `providers.tsx`).

---

## 3. Security & Row Level Security (RLS) Implementation

Security is enforced at two distinct boundaries:

### A. Middleware Route Guarding (`middleware.ts`)
Before rendering any page, Next.js Middleware validates the user's active session:
- Unauthenticated requests to `/admin/*` or `/employee/*` redirect immediately to `/login`.
- Non-admin accounts attempting to access `/admin/*` routes are redirected to their employee dashboard.

### B. Database Row Level Security (RLS)
Data integrity is enforced inside Supabase PostgreSQL, ensuring that client-side requests cannot bypass business logic:

1. **Tasks Table:**
   - Admins possess full CRUD access (`ALL`) to assign, modify, or delete tasks.
   - Employees are restricted to `UPDATE` operations only on records where `assigned_to = auth.uid()`, allowing status modifications (e.g., changing status to `completed`) while preventing unauthorized task tampering.

2. **Anonymous Feedback Table:**
   - Any authenticated user can execute an `INSERT` statement.
   - To guarantee complete anonymity, submission payloads omit user IDs or tracking metadata.
   - `SELECT` permission is restricted exclusively to profile records where `role = 'admin'`.

---

## 4. Performance, UX & Scaling Strategies

### A. Performance Optimization & Zero Layout Shift
- **Skeleton Screens (`loading.tsx`):** Route-level loading boundaries prevent Cumulative Layout Shift (CLS) during data fetching.
- **Client-Side Visualizations:** Recharts components render dynamically on the client side inside responsive containers to maintain smooth frame rates.

### B. Scalability Roadmap
- **Database Indexing:** Foreign keys on `tasks(assigned_to)` and timestamp indexes on `feedback(created_at)` optimize query lookups as record volumes scale into tens of thousands.
- **Serverless API Routes:** AI analysis processing operates in isolated serverless Next.js API endpoints, ensuring heavy language model processing does not block main database queries or user interactions.