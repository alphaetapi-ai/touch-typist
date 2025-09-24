import React, { useState, useEffect } from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';
import { getDefaultKeyboardLayout } from '../utils/keyboardLayouts';

interface TouchTypistProps {}

interface WordsState {
  typed: string;
  current: string;
  remainder: string;
  pending: string[];
}

export const TouchTypist: React.FC<TouchTypistProps> = () => {
  const [wordsState, setWordsState] = useState<WordsState>({
    typed: "",
    current: "",
    remainder: "",
    pending: []
  });

  const generateRandomWord = (): string => {
    const keyboardLayout = getDefaultKeyboardLayout();
    const thirdRow = keyboardLayout[2]; // Third row (index 2)

    // Extract valid characters from third row, excluding empty spaces
    const characters: string[] = [];
    thirdRow.forEach(key => {
      if (key !== "  ") {
        // For keys with two characters, use both
        if (key.length === 2) {
          characters.push(key[0].toLowerCase());
          characters.push(key[1].toLowerCase());
        } else {
          characters.push(key.toLowerCase());
        }
      }
    });

    // Generate 5-character word
    let word = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      word += characters[randomIndex];
    }
    return word;
  };

  const generatePhrase = (): string => {
    const words: string[] = [];
    for (let i = 0; i < 5; i++) {
      words.push(generateRandomWord());
    }
    return words.join(' ');
  };

  const initializeWordsState = (): void => {
    const pending: string[] = [];
    for (let i = 0; i < 5; i++) {
      pending.push(generatePhrase());
    }

    const firstPhrase = generatePhrase();
    const words = firstPhrase.split(' ');
    const current = words[0];
    const remainder = words.slice(1).join(' ');

    setWordsState({
      typed: "",
      current,
      remainder,
      pending
    });
  };

  const handleWordMatch = (typedWord: string): boolean => {
    if (typedWord.toLowerCase() === wordsState.current.toLowerCase()) {
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
      } else if (wordsState.pending.length > 0) {
        // Move first phrase from pending to remainder/current
        const firstPhrase = wordsState.pending[0];
        const phraseWords = firstPhrase.split(' ');
        const newCurrent = phraseWords[0];
        const newRemainder = phraseWords.slice(1).join(' ');
        const newPending = [...wordsState.pending.slice(1), generatePhrase()];

        setWordsState({
          typed: "", // Start fresh for new phrase
          current: newCurrent,
          remainder: newRemainder,
          pending: newPending
        });
      }
      return true; // Match found
    }
    return false; // No match
  };

  useEffect(() => {
    initializeWordsState();
  }, []);

  return (
    <div className="app-container">
      <PendingWords wordsState={wordsState} />

      <TypingBox onWordSubmit={handleWordMatch} />

      <KeyboardGrid />
    </div>
  );
};