'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Move the component that uses `useSearchParams()` into a sub-component
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // or whatever parameters you read

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <p className="text-sm text-gray-600">
        Please check your inbox to complete registration.
      </p>
      {/* Your existing verify email logic/UI */}
    </div>
  );
}

// 2. Wrap that sub-component in a <Suspense> boundary inside the exported Page
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}