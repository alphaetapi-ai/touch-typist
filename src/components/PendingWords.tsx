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
        <span className="pending-words-typed">{wordsState.typed}</span>
        {wordsState.typed && ' '}
        <span className="pending-words-current">{wordsState.current}</span>
        {wordsState.remainder && ' '}
        <span className="pending-words-remainder">{wordsState.remainder}</span>
      </p>
      {wordsState.pending.map((phrase, index) => (
        <p key={index}>{phrase}</p>
      ))}
    </div>
  );
};