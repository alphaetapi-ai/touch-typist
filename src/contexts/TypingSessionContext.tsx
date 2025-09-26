import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { getKeyboardLayout, getDefaultKeyboardLayout, keyLevels } from '../utils/keyboardLayouts';
import { useAppSettings } from './AppSettingsContext';

// Types for the typing session
export interface WordsState {
  typed: string;
  current: string;
  remainder: string;
  pending: string[];
}

interface TypingSessionContextType {
  // Typing state
  wordsState: WordsState;
  speed: number;
  highlightedKey: string;

  // Computed values
  currentWPM: number;

  // Actions
  submitWord: (word: string) => boolean;
  updateHighlight: (key: string) => void;
  resetSession: () => void;
  initializeSession: (overrideLevel?: number) => void;
}

// Create the context
const TypingSessionContext = createContext<TypingSessionContextType | undefined>(undefined);

// Provider component
interface TypingSessionProviderProps {
  children: ReactNode;
}

export const TypingSessionProvider: React.FC<TypingSessionProviderProps> = ({ children }) => {
  // Get app settings from context
  const { level, selectedLayout, shiftMode, setLevel } = useAppSettings();

  // Session state
  const [wordsState, setWordsState] = useState<WordsState>({
    typed: "",
    current: "",
    remainder: "",
    pending: []
  });
  const [speed, setSpeed] = useState<number>(10);
  const [highlightedKey, setHighlightedKey] = useState<string>("");
  const wordStartTime = useRef<number>(Date.now());

  // Generate random words based on current level and keyboard layout
  const generateRandomWord = useCallback((currentLevel: number, layoutName: string): string => {
    const keyboardLayout = getKeyboardLayout(layoutName) || getDefaultKeyboardLayout();

    // Get all available characters for current level and below
    const availableCharacters: string[] = [];
    const currentLevelCharacters: string[] = [];

    for (let row = 0; row < keyLevels.length; row++) {
      for (let col = 0; col < keyLevels[row].length; col++) {
        const keyLevel = keyLevels[row][col];
        const keyData = keyboardLayout[row][col];

        if (keyLevel > 0 && keyLevel <= currentLevel && keyData && keyData !== "  ") {
          // Extract characters from key
          if (keyData.length === 2) {
            const char1 = keyData[0].toLowerCase();
            const char2 = keyData[1].toLowerCase();

            if (shiftMode) {
              // Use both characters when shift mode is on
              availableCharacters.push(char1, char2);
              if (keyLevel === currentLevel) {
                currentLevelCharacters.push(char1, char2);
              }
            } else {
              // Only use first character (unshifted) when shift mode is off
              availableCharacters.push(char1);
              if (keyLevel === currentLevel) {
                currentLevelCharacters.push(char1);
              }
            }
          } else {
            const char = keyData.toLowerCase();
            availableCharacters.push(char);

            if (keyLevel === currentLevel) {
              currentLevelCharacters.push(char);
            }
          }
        }
      }
    }

    // Generate words until we get one with at least one current level character
    let word: string;
    let hasCurrentLevelChar: boolean;

    do {
      word = "";
      hasCurrentLevelChar = false;

      // Generate 5-character word from available characters
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        const char = availableCharacters[randomIndex];
        word += char;

        // Check if this character is from current level
        if (currentLevelCharacters.includes(char)) {
          hasCurrentLevelChar = true;
        }
      }
    } while (!hasCurrentLevelChar && currentLevelCharacters.length > 0 && currentLevel < 25);

    return word;
  }, [selectedLayout, shiftMode]); // Intentionally excludes level - automatic level progression shouldn't regenerate words

  const generatePhrase = useCallback((currentLevel: number = level, layoutName: string = selectedLayout): string => {
    const words: string[] = [];
    for (let i = 0; i < 5; i++) {
      words.push(generateRandomWord(currentLevel, layoutName));
    }
    return words.join(' ');
  }, [generateRandomWord, selectedLayout]); // Intentionally excludes level - prevents regeneration on automatic progression

  // Set up a new typing session with fresh word content
  const initializeSession = useCallback((overrideLevel?: number): void => {
    const currentLevel = overrideLevel ?? level;

    const pending: string[] = [];
    for (let i = 0; i < 1; i++) {
      pending.push(generatePhrase(currentLevel, selectedLayout));
    }

    const firstPhrase = generatePhrase(currentLevel, selectedLayout);
    const words = firstPhrase.split(' ');
    const current = words[0];
    const remainder = words.slice(1).join(' ');

    setWordsState({
      typed: "",
      current,
      remainder,
      pending
    });
    wordStartTime.current = Date.now();
  }, [generatePhrase, selectedLayout]); // Intentionally excludes level - prevents regeneration on automatic progression

  // Process submitted word, update speed, and advance to next word
  const submitWord = useCallback((typedWord: string): boolean => {
    if (typedWord.toLowerCase() === wordsState.current.toLowerCase()) {
      // Calculate time for this word and update speed
      const wordTime = (Date.now() - wordStartTime.current) / 1000; // Convert to seconds
      const cappedWordTime = Math.min(wordTime, 10); // Cap at 10 seconds
      const newSpeed = speed * 0.9 + cappedWordTime * 0.1;
      setSpeed(newSpeed);

      // Check for level progression
      if (newSpeed < 5 && level < 25) {
        setLevel(level + 1); // This will trigger useEffect in consuming components
        setSpeed(10); // Reset speed to 10 seconds
      }

      const newTyped = wordsState.typed ? `${wordsState.typed} ${wordsState.current}` : wordsState.current;

      if (wordsState.remainder) {
        // Move first word from remainder to current
        const remainderWords = wordsState.remainder.split(' ');
        const newCurrent = remainderWords[0];
        const newRemainder = remainderWords.slice(1).join(' ');

        setWordsState({
          ...wordsState,
          typed: newTyped,
          current: newCurrent,
          remainder: newRemainder
        });
        wordStartTime.current = Date.now();
      } else if (wordsState.pending.length > 0) {
        // Move first phrase from pending to remainder/current
        const firstPhrase = wordsState.pending[0];
        const phraseWords = firstPhrase.split(' ');
        const newCurrent = phraseWords[0];
        const newRemainder = phraseWords.slice(1).join(' ');
        const newPending = [...wordsState.pending.slice(1), generatePhrase(level, selectedLayout)];

        setWordsState({
          typed: "", // Start fresh for new phrase
          current: newCurrent,
          remainder: newRemainder,
          pending: newPending
        });
        wordStartTime.current = Date.now();
      }
      return true; // Match found
    }
    return false; // No match
  }, [wordsState, speed, level, setLevel, generatePhrase, selectedLayout]);

  // Set which key should be visually highlighted on the keyboard
  const updateHighlight = useCallback((key: string): void => {
    setHighlightedKey(key);
  }, []);

  // Start over with a completely fresh typing session
  const resetSession = useCallback((): void => {
    setSpeed(10);
    initializeSession();
  }, [initializeSession]);

  // Computed values
  const currentWPM = 60 / speed;

  const contextValue: TypingSessionContextType = {
    // State
    wordsState,
    speed,
    highlightedKey,

    // Computed
    currentWPM,

    // Actions
    submitWord,
    updateHighlight,
    resetSession,
    initializeSession,
  };

  return (
    <TypingSessionContext.Provider value={contextValue}>
      {children}
    </TypingSessionContext.Provider>
  );
};

// Custom hook for consuming the context
export const useTypingSession = (): TypingSessionContextType => {
  const context = useContext(TypingSessionContext);
  if (context === undefined) {
    throw new Error('useTypingSession must be used within a TypingSessionProvider');
  }
  return context;
};