'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const supabase = createClient();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Modal States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setFeedbackList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiSummary(null);

    try {
      const response = await fetch('/api/ai/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: filteredFeedback }),
      });

      const result = await response.json();

      // Formats the response cleanly whether it returns a summary string or JSON sentiment data
      const summaryText = typeof result === 'string' 
        ? result 
        : result.summary 
        ? result.summary 
        : `Overall Sentiment: ${result.sentiment}\n\nKey Takeaways:\n• ` + (result.keyTakeaways || []).join('\n• ');

      setAiSummary(summaryText || 'Unable to generate analysis at this time.');
    } catch {
      setAiSummary('Failed to trigger AI sentiment analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(feedbackList.map((item) => item.category)))];

  const filteredFeedback = feedbackList.filter((item) => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Anonymous Feedback Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review employee concerns and suggestions</p>
        </div>

        <button
          onClick={handleAiAnalysis}
          disabled={isAnalyzing || filteredFeedback.length === 0}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {isAnalyzing ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <span>✨</span> Analyze Feedback with AI
            </>
          )}
        </button>
      </div>

      {/* AI Summary Banner */}
      {aiSummary && (
        <div className="p-5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
            <span>🤖</span> AI Insights & Key Themes
          </h3>
          <p className="text-sm text-purple-800 dark:text-purple-200 whitespace-pre-wrap">{aiSummary}</p>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search feedback contents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 w-full sm:w-72 text-sm"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading inbox...</div>
      ) : filteredFeedback.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500">
          No feedback entries match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}