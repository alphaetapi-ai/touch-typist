import React from 'react';

interface PendingWordsProps {}

export const PendingWords: React.FC<PendingWordsProps> = () => {
  return (
    <div className="pending-words-container">
      <p>One</p>
      <p>Two</p>
    </div>
  );
};