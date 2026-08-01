'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EmployeeFeedbackPage() {
  const supabase = createClient();
  const [category, setCategory] = useState('Workplace Culture');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Explicitly insert without attaching user_id to ensure anonymity
    const { error: insertError } = await supabase.from('feedback').insert([
      {
        category,
        message,
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Anonymous Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your feedback is completely anonymous and helps improve our organization.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800 text-sm">
          Thank you! Your feedback has been submitted anonymously.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Workplace Culture">Workplace Culture</option>
            <option value="Management & Support">Management & Support</option>
            <option value="Compensation & Benefits">Compensation & Benefits</option>
            <option value="Tools & Resources">Tools & Resources</option>
            <option value="General Suggestion">General Suggestion</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Feedback
          </label>
          <textarea
            required
            rows={5}
            placeholder="Share your honest thoughts..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Anonymous Feedback'}
        </button>
      </form>
    </div>
  );
}