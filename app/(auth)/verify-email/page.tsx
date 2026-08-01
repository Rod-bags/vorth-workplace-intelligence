'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-md w-full space-y-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Check Your Email
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        We have sent a verification link to{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {email || 'your email address'}
        </span>
        . Please check your inbox and follow the link to verify your account.
      </p>
      <div className="pt-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<p className="text-sm text-gray-500">Loading verification details...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}