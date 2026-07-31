'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const CATEGORIES = [
  'General',
  'Work Environment',
  'Management',
  'Compensation & Benefits',
  'Company Culture',
  'Suggestions',
];

export default function EmployeeFeedbackPage() {
  const supabase = createClient();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Completely anonymous insert - no user ID or identity metadata passed
    const { error } = await supabase.from('feedback').insert([
      {
        category,
        message,
        status: 'unread',
      },
    ]);

    if (error) {
      toast.error('Failed to submit feedback', {
        description: error.message,
      });
    } else {
      toast.success('Feedback sent anonymously!', {
        description: 'Your responses remain 100% untracked and secure.',
      });
      setMessage('');
      setCategory(CATEGORIES[0]);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Anonymous Feedback</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your voice matters. All submissions are completely untracked and encrypted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
              Your Feedback
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your honest thoughts, constructive criticisms, or ideas..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {loading ? 'Submitting Anonymously...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}