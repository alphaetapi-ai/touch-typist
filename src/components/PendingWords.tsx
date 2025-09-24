import React, { useEffect } from 'react';

interface PendingWordsProps {
  words: string[];
  onWordsGenerated: (words: string[]) => void;
  generateRandomWord: () => string;
}

export const PendingWords: React.FC<PendingWordsProps> = ({
  words,
  onWordsGenerated,
  generateRandomWord
}) => {
  const generateInitialWords = (): void => {
    const newWords: string[] = [];
    for (let i = 0; i < 6; i++) {
      newWords.push(generateRandomWord());
    }
    onWordsGenerated(newWords);
  };

  useEffect(() => {
    if (words.length === 0) {
      generateInitialWords();
    }
  }, []);

  return (
    <div className="pending-words-container">
      {words.map((word, index) => (
        <p key={index}>{word}</p>
      ))}
    </div>
  );
};