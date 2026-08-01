'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // 1. Fetch all announcements
  async function fetchAnnouncements() {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 2. Handle creating a new announcement
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('announcements').insert([
      {
        title,
        content,
        created_by: user?.id,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Announcement posted successfully!');
      setTitle('');
      setContent('');
      fetchAnnouncements(); // Refresh list
    }

    setSubmitting(false);
  }

  // 3. Handle deleting an announcement
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) {
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } else {
      setMessage(`Error: ${error.message}`);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Announcements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create and manage broadcast announcements for all employees.
        </p>
      </div>

      {/* Post New Announcement Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Post New Announcement
        </h2>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.startsWith('Error')
                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (message) setMessage(null);
              }}
              placeholder="e.g. Q3 Townhall Meeting Scheduled"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (message) setMessage(null);
              }}
              placeholder="Write the announcement details here..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      </div>

      {/* Announcement History List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Recent Announcements
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements posted yet.</p>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start"
            >
              <div className="space-y-2 max-w-3xl">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {item.content}
                </p>
                <p className="text-xs text-gray-400">
                  Posted on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 font-medium border border-red-200 dark:border-red-800 px-2.5 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}