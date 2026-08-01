import { updatePassword } from '../actions';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        {params?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{params.error}</div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}