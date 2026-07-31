'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Fetch profile to redirect to correct role dashboard
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/employee/dashboard');
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as 'admin' | 'employee';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role || 'employee',
      },
    },
  });

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/login?message=Account created! Please sign in.');
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}