import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface KeyboardHighlightContextType {
  highlightedKey: string;
  updateHighlightForInput: (input: string, target: string) => void;
}

const KeyboardHighlightContext = createContext<KeyboardHighlightContextType | undefined>(undefined);

interface KeyboardHighlightProviderProps {
  children: ReactNode;
}

export const KeyboardHighlightProvider: React.FC<KeyboardHighlightProviderProps> = ({ children }) => {
  const [highlightedKey, setHighlightedKey] = useState<string>("");

  const calculateHighlightedKey = useCallback((input: string, target: string): string => {
    if (!target) return "";

    if (input === "") {
      // Empty input - highlight first character of current word
      return target[0].toLowerCase();
    } else if (target.toLowerCase().startsWith(input.toLowerCase())) {
      if (input.toLowerCase() === target.toLowerCase()) {
        // Exact match - highlight Return key
        return "return";
      } else {
        // Partial match - highlight next character
        return target[input.length].toLowerCase();
      }
    } else {
      // No match - highlight Backspace
      return "backspace";
    }
  }, []);

  const updateHighlightForInput = useCallback((input: string, target: string): void => {
    const key = calculateHighlightedKey(input, target);
    setHighlightedKey(key);
  }, [calculateHighlightedKey]);

  const contextValue: KeyboardHighlightContextType = {
    highlightedKey,
    updateHighlightForInput,
  };

  return (
    <KeyboardHighlightContext.Provider value={contextValue}>
      {children}
    </KeyboardHighlightContext.Provider>
  );
};

export const useKeyboardHighlight = (): KeyboardHighlightContextType => {
  const context = useContext(KeyboardHighlightContext);
  if (context === undefined) {
    throw new Error('useKeyboardHighlight must be used within a KeyboardHighlightProvider');
  }
  return context;
};