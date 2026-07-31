-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
  department TEXT DEFAULT 'Unassigned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ANONYMOUS FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('unread', 'reviewed', 'archived')) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tasks Policies
CREATE POLICY "Tasks viewable by authenticated users" 
  ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Tasks manageable by admins" 
  ON public.tasks FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Employees can update assigned task status" 
  ON public.tasks FOR UPDATE USING (assigned_to = auth.uid());

-- Feedback Policies (Anonymous Submissions)
CREATE POLICY "Anyone authenticated can insert feedback" 
  ON public.feedback FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Feedback viewable by admins only" 
  ON public.feedback FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );