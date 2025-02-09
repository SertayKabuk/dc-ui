'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshProps {
  interval: number;
  onRefresh: () => Promise<void>;
  delayBeforeRefresh?: number;
}

export function useAutoRefresh({ 
  interval, 
  onRefresh, 
  delayBeforeRefresh = 100 
}: UseAutoRefreshProps) {
  const [timeLeft, setTimeLeft] = useState(interval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    setError(null);

    try {
      // Add a small delay to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, delayBeforeRefresh));
      await onRefresh();
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing');
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
      isRefreshingRef.current = false;
      setTimeLeft(interval);
    }
  }, [interval, onRefresh, delayBeforeRefresh]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !isRefreshingRef.current) {
          handleRefresh();
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [interval, handleRefresh]);

  return {
    timeLeft,
    isRefreshing,
    lastUpdated,
    error,
    handleRefresh,
    clearError: () => setError(null)
  };
}