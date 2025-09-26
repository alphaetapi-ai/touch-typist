import React, { useState, useEffect } from 'react';
import { useKeyboardHighlight } from '../contexts/KeyboardHighlightContext';

interface TypingBoxProps {
  onWordSubmit: (word: string) => boolean;
  currentWord: string;
}

export const TypingBox: React.FC<TypingBoxProps> = ({
  onWordSubmit,
  currentWord
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const { updateHighlightForInput } = useKeyboardHighlight();

  useEffect(() => {
    updateHighlightForInput(textInput, currentWord);
  }, [textInput, currentWord, updateHighlightForInput]);

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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};