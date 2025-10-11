import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { useAppSettings } from './AppSettingsContext';

// Types
interface WordCache {
  [key: string]: string[] | undefined; // key format: "layout-shift-level"
}

interface FetchingState {
  [key: string]: boolean; // track which levels are currently being fetched
}

interface WordCacheContextType {
  getWordsForLevel: (level: number, layout: string, shift: boolean) => string[] | null;
  preFetchLevel: (level: number, layout: string, shift: boolean) => void;
}

// Create context
const WordCacheContext = createContext<WordCacheContextType | undefined>(undefined);

// Provider component
interface WordCacheProviderProps {
  children: ReactNode;
}

export const WordCacheProvider: React.FC<WordCacheProviderProps> = ({ children }) => {
  const { selectedLayout, shiftMode, level } = useAppSettings();
  const cache = useRef<WordCache>({});
  const fetchingState = useRef<FetchingState>({});

  // Generate cache key
  const getCacheKey = useCallback((level: number, layout: string, shift: boolean): string => {
    const shiftStr = shift ? 'shift' : 'no-shift';
    return `${layout}-${shiftStr}-${level}`;
  }, []);

  // Fetch words from API
  const fetchWords = useCallback(async (level: number, layout: string, shift: boolean): Promise<void> => {
    const key = getCacheKey(level, layout, shift);

    // Don't fetch if already fetching or already cached
    if (fetchingState.current[key] || cache.current[key]) {
      return;
    }

    fetchingState.current[key] = true;

    try {
      const shiftParam = shift ? 'shift' : 'no-shift';
      const layoutLower = layout.toLowerCase();
      const response = await fetch(`/api/words?layout=${layoutLower}&shift=${shiftParam}&level=${level}`);

      if (!response.ok) {
        console.error(`Failed to fetch words for level ${level}`);
        return;
      }

      const data = await response.json();
      const words = data.words as string[];

      console.log(`[WordCache] Fetched level ${level} (${layout}, ${shift ? 'shift' : 'no-shift'}): ${words.length} words`);

      cache.current[key] = words;
    } catch (error) {
      console.error(`Error fetching words for level ${level}:`, error);
    } finally {
      fetchingState.current[key] = false;
    }
  }, [getCacheKey]);

  // Get words from cache (returns null if not cached)
  const getWordsForLevel = useCallback((level: number, layout: string, shift: boolean): string[] | null => {
    const key = getCacheKey(level, layout, shift);
    return cache.current[key] || null;
  }, [getCacheKey]);

  // Pre-fetch a specific level
  const preFetchLevel = useCallback((level: number, layout: string, shift: boolean): void => {
    if (level >= 1 && level <= 24) {
      fetchWords(level, layout, shift);
    }
  }, [fetchWords]);

  // Pre-fetch levels 1-3 on startup
  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      preFetchLevel(i, selectedLayout, shiftMode);
    }
  }, []); // Only run once on mount

  // Pre-fetch current level and next level when settings or level change
  useEffect(() => {
    // Fetch current level
    if (level <= 24) {
      preFetchLevel(level, selectedLayout, shiftMode);
    } else if (level === 25) {
      // For level 25, fetch all levels 1-24
      for (let i = 1; i <= 24; i++) {
        preFetchLevel(i, selectedLayout, shiftMode);
      }
    }

    // Pre-fetch next level (if not at max)
    if (level < 24) {
      preFetchLevel(level + 1, selectedLayout, shiftMode);
    }
  }, [level, selectedLayout, shiftMode, preFetchLevel]);

  const contextValue: WordCacheContextType = {
    getWordsForLevel,
    preFetchLevel
  };

  return (
    <WordCacheContext.Provider value={contextValue}>
      {children}
    </WordCacheContext.Provider>
  );
};

// Custom hook
export const useWordCache = (): WordCacheContextType => {
  const context = useContext(WordCacheContext);
  if (context === undefined) {
    throw new Error('useWordCache must be used within a WordCacheProvider');
  }
  return context;
};
