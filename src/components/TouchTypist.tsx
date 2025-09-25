import React, { useState, useEffect } from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';
import { getDefaultKeyboardLayout, keyLevels, getKeyboardLayout } from '../utils/keyboardLayouts';

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
  const [level, setLevel] = useState<number>(2);
  const [speed, setSpeed] = useState<number>(10);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [shiftMode, setShiftMode] = useState<boolean>(false);
  const [selectedLayout, setSelectedLayout] = useState<string>("Qwerty");

  const generateRandomWord = (currentLevel: number = level, layoutName: string = selectedLayout): string => {
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
  };

  const generatePhrase = (currentLevel: number = level, layoutName: string = selectedLayout): string => {
    const words: string[] = [];
    for (let i = 0; i < 5; i++) {
      words.push(generateRandomWord(currentLevel, layoutName));
    }
    return words.join(' ');
  };

  const handleLevelChange = (newLevel: number): void => {
    if (newLevel >= 1 && newLevel <= 25) {
      setLevel(newLevel);
      setSpeed(10); // Reset speed to 10 seconds
      initializeWordsState(newLevel);
    }
  };

  const handleShiftChange = (newShiftMode: boolean): void => {
    setShiftMode(newShiftMode);
    initializeWordsState();
  };

  const handleLayoutChange = (newLayout: string): void => {
    setSelectedLayout(newLayout);
    initializeWordsState(level, newLayout);
  };

  const initializeWordsState = (currentLevel: number = level, layoutName: string = selectedLayout): void => {
    const pending: string[] = [];
    for (let i = 0; i < 1; i++) {
      pending.push(generatePhrase(currentLevel, layoutName));
    }

    const firstPhrase = generatePhrase(currentLevel, layoutName);
    const words = firstPhrase.split(' ');
    const current = words[0];
    const remainder = words.slice(1).join(' ');

    setWordsState({
      typed: "",
      current,
      remainder,
      pending
    });
    setWordStartTime(Date.now());
  };

  const handleWordMatch = (typedWord: string): boolean => {
    if (typedWord.toLowerCase() === wordsState.current.toLowerCase()) {
      // Calculate time for this word
      const wordTime = (Date.now() - wordStartTime) / 1000; // Convert to seconds
      const cappedWordTime = Math.min(wordTime, 10); // Cap at 10 seconds

      // Update speed using weighted average
      const newSpeed = speed * 0.9 + cappedWordTime * 0.1;
      setSpeed(newSpeed);

      // Check for level progression
      if (newSpeed < 5 && level < 25) {
        setLevel(level + 1);
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
        setWordStartTime(Date.now());
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
        setWordStartTime(Date.now());
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
      <div className="about-box">
        TouchTypist by Adam Peterson<br />
        <a href="https://github.com/alphaetapi-ai/touch-typist" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <div className="level-display">Level: {level} | Speed: {(60 / speed).toFixed(1)} WPM</div>
      <div className="controls">
        <button
          onClick={() => handleLevelChange(level - 1)}
          disabled={level <= 1}
        >
          -1
        </button>
        <button
          onClick={() => handleLevelChange(level + 1)}
          disabled={level >= 25}
        >
          +1
        </button>
        <label>
          <input
            type="checkbox"
            checked={shiftMode}
            onChange={(e) => handleShiftChange(e.target.checked)}
          />
          Shift?
        </label>
        <label>
          Layout:
          <select
            value={selectedLayout}
            onChange={(e) => handleLayoutChange(e.target.value)}
          >
            <option value="Qwerty">Qwerty</option>
            <option value="Dvorak">Dvorak</option>
          </select>
        </label>
      </div>
      <PendingWords wordsState={wordsState} />

      <TypingBox
        onWordSubmit={handleWordMatch}
        currentWord={wordsState.current}
        onHighlightChange={setHighlightedKey}
      />

      <KeyboardGrid highlightedKey={highlightedKey} currentLevel={level} selectedLayout={selectedLayout} />
    </div>
  );
};