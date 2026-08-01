'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EmployeeAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    }
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Announcements</h1>
        <p className="text-sm text-gray-500">Stay updated with organizational announcements.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-gray-500">No announcements posted yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.content}</p>
              <p className="text-xs text-gray-400">
                Posted on {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}