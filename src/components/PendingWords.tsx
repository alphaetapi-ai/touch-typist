import React from 'react';

interface WordsState {
  typed: string;
  current: string;
  remainder: string;
  pending: string[];
}

interface PendingWordsProps {
  wordsState: WordsState;
}

export const PendingWords: React.FC<PendingWordsProps> = ({ wordsState }) => {
  return (
    <div className="pending-words-container">
      <p>
        <span>{wordsState.typed}</span>
        {wordsState.typed && ' '}
        <span>{wordsState.current}</span>
        {wordsState.remainder && ' '}
        <span>{wordsState.remainder}</span>
      </p>
      {wordsState.pending.map((phrase, index) => (
        <p key={index}>{phrase}</p>
      ))}
    </div>
  );
};