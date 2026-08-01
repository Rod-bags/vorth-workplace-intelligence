'use client';

import { useSearchParams } from 'next/navigation';
import { verifyEmailCode } from '../actions';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We sent a 6-digit confirmation code to{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <form action={verifyEmailCode} className="space-y-4">
          <input type="hidden" name="email" value={email} />

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Confirmation Code
            </label>
            <input
              type="text"
              name="code"
              required
              maxLength={6}
              placeholder="123456"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-2xl tracking-widest dark:bg-gray-700 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Verify & Continue
          </button>
        </form>
      </div>
    </div>
  );
}