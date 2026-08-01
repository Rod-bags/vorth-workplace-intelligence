'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// 1. Export Signup Action
export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  let userRole = (formData.get('role') as string) || 'Employee';

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password: formData.get('password') as string,
      options: {
        data: {
          full_name: formData.get('fullName') as string,
          role: userRole,
        },
      },
    });

    if (error) throw error;
  } catch (err: any) {
    return redirect('/register?error=' + encodeURIComponent(err.message));
  }

  // Redirect user to enter the 6-digit confirmation code
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

// 2. Export Email OTP Verification Action
export async function verifyEmailCode(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const token = formData.get('code') as string;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) {
    return redirect(
      `/verify-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`
    );
  }

  // Determine user role to route to correct portal after verification
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userRole = 'Employee';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) userRole = profile.role;
  }

  redirect(userRole === 'Admin' ? '/admin/dashboard' : '/employee/dashboard');
}

// 3. Export Login Action
export async function login(formData: FormData) {
  const supabase = await createClient();
  let userRole = 'Employee';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role) userRole = profile.role;
  } catch (err: any) {
    return redirect('/login?error=' + encodeURIComponent(err.message));
  }

  redirect(userRole === 'Admin' ? '/admin/dashboard' : '/employee/dashboard');
}

// 4. Send reset password email link
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return redirect('/forgot-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/forgot-password?success=Check your email for the password reset link.');
}

// 5. Update password after clicking reset link
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const newPassword = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return redirect('/auth/reset-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/login?message=Password updated successfully! Please log in.');
}