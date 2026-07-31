# Vorth Workplace Intelligence

An AI-driven workforce management and feedback analysis platform built with Next.js 14/15, Supabase, Tailwind CSS, and Recharts.

---

## 🚀 Features

- **Role-Based Access Control (RBAC):** Admin and Employee routing protected via middleware and Supabase RLS.
- **Task Management:** Admins can create, assign, edit, and delete employee tasks. Employees can view and update their task status.
- **Anonymous Feedback:** Employees can submit untracked, encrypted feedback by category.
- **AI Feedback Analysis:** Integrated AI API route analyzing feedback sentiment and extracting actionable workforce insights.
- **Analytics Dashboard:** Recharts visualizations detailing completion rates, employee allocation, and feedback trends.
- **Modern UI/UX:** Full Dark/Light theme toggle using `next-themes`, Skeleton loading states, and instant `sonner` toast notifications.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase project instance

### 2. Installation
Clone the repository and install dependencies:

\`\`\`bash
git clone <YOUR_GITHUB_REPO_URL>
cd vorth-workplace-intelligence
npm install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### 4. Database Setup
1. Log into your **Supabase Dashboard**.
2. Go to the **SQL Editor**.
3. Copy the contents of `schema.sql` from the root of this repo and run the query to set up tables and Row Level Security (RLS) policies.

### 5. Running Locally
Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Known Limitations

- **AI API Rate Limits:** Free-tier OpenAI keys may hit rate limits during heavy feedback batch processing.
- **Email Notifications:** Mocked in development; direct email dispatch via Resend/SendGrid is pending production integration.