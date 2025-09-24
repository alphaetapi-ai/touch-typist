import React, { useState, useEffect } from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';
import { getDefaultKeyboardLayout, keyLevels } from '../utils/keyboardLayouts';

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
  const [highlightedKey, setHighlightedKey] = useState<string>("");
  const [level, setLevel] = useState<number>(4);

  const generateRandomWord = (): string => {
    const keyboardLayout = getDefaultKeyboardLayout();

    // Get all available characters for current level and below
    const availableCharacters: string[] = [];
    const currentLevelCharacters: string[] = [];

    for (let row = 0; row < keyLevels.length; row++) {
      for (let col = 0; col < keyLevels[row].length; col++) {
        const keyLevel = keyLevels[row][col];
        const keyData = keyboardLayout[row][col];

        if (keyLevel > 0 && keyLevel <= level && keyData && keyData !== "  ") {
          // Extract characters from key
          if (keyData.length === 2) {
            const char1 = keyData[0].toLowerCase();
            const char2 = keyData[1].toLowerCase();

            availableCharacters.push(char1, char2);

            // If this key is exactly at current level, add to current level pool
            if (keyLevel === level) {
              currentLevelCharacters.push(char1, char2);
            }
          } else {
            const char = keyData.toLowerCase();
            availableCharacters.push(char);

            if (keyLevel === level) {
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
    } while (!hasCurrentLevelChar && currentLevelCharacters.length > 0);

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
    for (let i = 0; i < 2; i++) {
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
      <div className="level-display">Level: {level}</div>
      <PendingWords wordsState={wordsState} />

      <TypingBox
        onWordSubmit={handleWordMatch}
        currentWord={wordsState.current}
        onHighlightChange={setHighlightedKey}
      />

      <KeyboardGrid highlightedKey={highlightedKey} currentLevel={level} />
    </div>
  );
};