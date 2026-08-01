'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read?: boolean;
}

export default function EmployeeAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements and cross-reference with the user's read receipts
  async function fetchAnnouncements() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [{ data: items }, { data: readReceipts }] = await Promise.all([
        supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('announcement_reads')
          .select('announcement_id')
          .eq('user_id', user.id),
      ]);

      const readIds = new Set(readReceipts?.map((r) => r.announcement_id) || []);

      if (items) {
        setAnnouncements(
          items.map((item) => ({
            ...item,
            is_read: readIds.has(item.id),
          }))
        );
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Mark a specific announcement as read
  async function markAsRead(announcementId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('announcement_reads')
      .insert([{ announcement_id: announcementId, user_id: user.id }]);

    if (!error) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === announcementId ? { ...item, is_read: true } : item
        )
      );
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Announcements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stay updated with organizational announcements.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-gray-500">No announcements posted yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border shadow-sm transition-colors flex justify-between items-start gap-4 ${
                item.is_read
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                  : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900'
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {item.title}
                  </h3>
                  {!item.is_read && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {item.content}
                </p>
                <p className="text-xs text-gray-400">
                  Posted on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              {!item.is_read ? (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                >
                  Mark as Read
                </button>
              ) : (
                <span className="text-xs text-gray-400 italic">Read</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}