'use client';

import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'toolnest_history';
const MAX_HISTORY = 50;

export interface HistoryItem {
  toolId: string;
  toolTitle: string;
  toolRoute: string;
  usedAt: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const addToHistory = useCallback((toolId: string, toolTitle: string, toolRoute: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toolId !== toolId);
      const newItem: HistoryItem = {
        toolId,
        toolTitle,
        toolRoute,
        usedAt: new Date().toISOString(),
      };
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const removeFromHistory = useCallback((toolId: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.toolId !== toolId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory, isLoaded };
}
