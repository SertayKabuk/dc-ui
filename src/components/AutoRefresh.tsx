'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface TimeDisplayProps {
  date: Date;
}

// Client-side only time display component
function TimeDisplay({ date }: TimeDisplayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>{date.toLocaleTimeString()}</span>;
}

interface AutoRefreshProps {
  interval?: number; // in seconds
  onRefresh: () => Promise<void>;
}

export default function AutoRefresh({ interval = 60, onRefresh }: AutoRefreshProps) {
  const { timeLeft, isRefreshing, lastUpdated, error, handleRefresh, clearError } = useAutoRefresh({
    interval,
    onRefresh
  });

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {isRefreshing ? (
          <LoadingSpinner />
        ) : (
          <>
            <button
              onClick={() => handleRefresh()}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              disabled={isRefreshing}
            >
              🔄 Refresh
            </button>
            <span>·</span>
          </>
        )}
        <span>
          Next refresh in {timeLeft}s
        </span>
        <span>·</span>
        <span>
          Last updated: <TimeDisplay date={lastUpdated} />
        </span>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}