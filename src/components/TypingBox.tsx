import React, { useState, useEffect } from 'react';

interface TypingBoxProps {
  onWordSubmit: (word: string) => boolean;
  currentWord: string;
  onHighlightChange: (key: string) => void;
}

export const TypingBox: React.FC<TypingBoxProps> = ({
  onWordSubmit,
  currentWord,
  onHighlightChange
}) => {
  const [textInput, setTextInput] = useState<string>('');

  const calculateHighlightedKey = (input: string, target: string): string => {
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
  };

  useEffect(() => {
    const highlightedKey = calculateHighlightedKey(textInput, currentWord);
    onHighlightChange(highlightedKey);
  }, [textInput, currentWord, onHighlightChange]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = textInput.trim();
      if (trimmedInput) {
        const wasMatch = onWordSubmit(trimmedInput);
        if (wasMatch) {
          setTextInput('');
        } else if (e.key === ' ') {
          // If word didn't match and it was a space, add the space to the input
          setTextInput(textInput + ' ');
        }
      }
    }
  };

  return (
    <div className="typing-box-container">
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type here..."
        className="typing-box-input"
      />
    </div>
  );
};