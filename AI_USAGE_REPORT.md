# AI Usage Report

## 1. Tool Mapping & Roles

| Tool / Model | Primary Usage Area | Purpose |
| :--- | :--- | :--- |
| **Gemini / ChatGPT** | Architecture & UI Code Generation | Boilerplate generation, Tailwind styling, Recharts integration, and UI component structures. |
| **GitHub Copilot / IDE Assistants** | Code Completion & Refactoring | Inline auto-completion, TypeScript interface generation, and syntax corrections. |

---

## 2. Prompt Engineering Strategies

- **Context-First Prompting:** Provided the exact Next.js App Router folder structure (`app/admin/...`, `app/employee/...`) prior to requesting code to ensure correct file placement and exports.
- **Incremental Feature Iteration:** Requested features in distinct phases (Authentication setup $\rightarrow$ RLS policies $\rightarrow$ Admin/Employee dashboards $\rightarrow$ Recharts analytics $\rightarrow$ UI polish).
- **Bug Fix Prompting:** Pasted raw build/terminal errors alongside specific line numbers to receive surgical code corrections rather than full file rewrites.

---

## 3. Evaluated & Applied Code (Kept vs. Rejected)

### Kept AI Code
- **Recharts Analytics Config:** Leveraged AI-generated responsive container configurations for `LineChart`, `BarChart`, and `PieChart` components in `app/admin/analytics/page.tsx`.
- **Supabase Client & RLS Templates:** Applied AI-suggested Row Level Security (RLS) SQL policies for strict admin vs. employee data boundaries.
- **Next-Themes & Sonner Providers:** Used AI-provided provider wrapper setup in `components/providers.tsx` to handle SSR hydration cleanly.

### Rejected / Refactored AI Code
- **Monolithic Page Layouts:** Rejected initially suggested single-file admin dashboards in favor of modular page routes (`/admin/tasks`, `/admin/employees`, `/admin/feedback`, `/admin/analytics`).
- **Client-Side Auth Checks:** Rejected AI proposals relying purely on `useEffect` for page protection; implemented server-side Middleware (`middleware.ts`) for secure route guarding.
- **Overly Generic Toasts:** Refactored default alert messages into custom `sonner` toast triggers with descriptive metadata (e.g., confirming anonymous, non-traceable feedback submission).