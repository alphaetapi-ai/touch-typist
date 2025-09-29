import React, { createContext, useContext, useState, useReducer, useRef, useCallback, ReactNode } from 'react';
import { getKeyboardLayout, getDefaultKeyboardLayout, keyLevels } from '../utils/keyboardLayouts';
import { useAppSettings } from './AppSettingsContext';

// Types for the typing session
export interface WordsState {
  typed: string;
  current: string;
  remainder: string;
  pending: string[];
}

// Action types for the words state reducer
type WordsAction =
  | { type: 'INITIALIZE_SESSION'; payload: { phrases: string[] } }
  | { type: 'SUBMIT_WORD'; payload: { typedWord: string; generatePhrase: () => string } }
  | { type: 'RESET_SESSION' };

// Reducer function for words state management - contains ALL state transition logic
const wordsReducer = (state: WordsState, action: WordsAction): WordsState => {
  switch (action.type) {
    case 'INITIALIZE_SESSION': {
      const { phrases } = action.payload;
      if (phrases.length === 0) {
        return { typed: "", current: "", remainder: "", pending: [] };
      }

      const firstPhrase = phrases[0];
      const words = firstPhrase.split(' ');
      const current = words[0];
      const remainder = words.slice(1).join(' ');
      const pending = phrases.slice(1);

      return {
        typed: "",
        current,
        remainder,
        pending
      };
    }

    case 'SUBMIT_WORD': {
      const { typedWord, generatePhrase } = action.payload;

      // Check if the word matches
      if (typedWord.toLowerCase() !== state.current.toLowerCase()) {
        return state; // No change if word doesn't match
      }

      // Calculate new typed text
      const newTyped = state.typed ? `${state.typed} ${state.current}` : state.current;

      if (state.remainder) {
        // Move first word from remainder to current
        const remainderWords = state.remainder.split(' ');
        const newCurrent = remainderWords[0];
        const newRemainder = remainderWords.slice(1).join(' ');

        return {
          ...state,
          typed: newTyped,
          current: newCurrent,
          remainder: newRemainder
        };
      } else if (state.pending.length > 0) {
        // Move first phrase from pending to remainder/current
        const firstPhrase = state.pending[0];
        const phraseWords = firstPhrase.split(' ');
        const newCurrent = phraseWords[0];
        const newRemainder = phraseWords.slice(1).join(' ');
        const newPending = [...state.pending.slice(1), generatePhrase()];

        return {
          typed: "", // Start fresh for new phrase
          current: newCurrent,
          remainder: newRemainder,
          pending: newPending
        };
      }

      // No more words available
      return state;
    }

    case 'RESET_SESSION':
      return {
        typed: "",
        current: "",
        remainder: "",
        pending: []
      };

    default:
      return state;
  }
};

interface TypingSessionContextType {
  // Typing state
  wordsState: WordsState;
  speed: number;

  // Computed values
  currentWPM: number;

  // Actions
  submitWord: (word: string) => boolean;
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

  // Session state using useReducer for complex words state
  const [wordsState, dispatch] = useReducer(wordsReducer, {
    typed: "",
    current: "",
    remainder: "",
    pending: []
  });
  const [speed, setSpeed] = useState<number>(10);
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

    // Generate initial phrases
    const phrases: string[] = [];
    for (let i = 0; i < 2; i++) { // Generate 2 phrases: 1 for current + 1 for pending
      phrases.push(generatePhrase(currentLevel, selectedLayout));
    }

    dispatch({
      type: 'INITIALIZE_SESSION',
      payload: { phrases }
    });
    wordStartTime.current = Date.now();
  }, [generatePhrase, selectedLayout]); // Intentionally excludes level - prevents regeneration on automatic progression

  // Process submitted word, update speed, and advance to next word
  const submitWord = useCallback((typedWord: string): boolean => {
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

    // Dispatch the word submission - reducer handles all the state logic
    dispatch({
      type: 'SUBMIT_WORD',
      payload: {
        typedWord,
        generatePhrase: () => generatePhrase(level, selectedLayout)
      }
    });

    // Check if the word matched (by comparing if state actually changed)
    const wordMatched = typedWord.toLowerCase() === wordsState.current.toLowerCase();
    if (wordMatched) {
      wordStartTime.current = Date.now();
    }

    return wordMatched;
  }, [wordsState.current, speed, level, setLevel, generatePhrase, selectedLayout]);


  // Start over with a completely fresh typing session
  const resetSession = useCallback((): void => {
    setSpeed(10);
    dispatch({ type: 'RESET_SESSION' });
    initializeSession();
  }, [initializeSession]);

  // Computed values
  const currentWPM = 60 / speed;

  const contextValue: TypingSessionContextType = {
    // State
    wordsState,
    speed,

    // Computed
    currentWPM,

    // Actions
    submitWord,
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