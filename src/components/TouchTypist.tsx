import React, { useState } from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';
import { getDefaultKeyboardLayout } from '../utils/keyboardLayouts';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {
  const [words, setWords] = useState<string[]>([]);

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

  const handleWordMatch = (typedWord: string): boolean => {
    if (words.length > 0 && typedWord.toLowerCase() === words[0].toLowerCase()) {
      // Remove first word and add new word
      const newWords = [...words.slice(1), generateRandomWord()];
      setWords(newWords);
      return true; // Match found
    }
    return false; // No match
  };


  return (
    <div className="app-container">
      <PendingWords words={words} onWordsGenerated={setWords} generateRandomWord={generateRandomWord} />

      <TypingBox onWordSubmit={handleWordMatch} />

      <KeyboardGrid />
    </div>
  );
};