import React, { useState, useEffect } from 'react';
import { getDefaultKeyboardLayout } from '../utils/keyboardLayouts';

interface PendingWordsProps {}

export const PendingWords: React.FC<PendingWordsProps> = () => {
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

  const generateWords = (): void => {
    const newWords: string[] = [];
    for (let i = 0; i < 6; i++) {
      newWords.push(generateRandomWord());
    }
    setWords(newWords);
  };

  useEffect(() => {
    generateWords();
  }, []);

  return (
    <div className="pending-words-container">
      {words.map((word, index) => (
        <p key={index}>{word}</p>
      ))}
    </div>
  );
};