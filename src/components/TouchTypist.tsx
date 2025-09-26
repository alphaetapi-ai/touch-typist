import React, { useState, useEffect } from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';
import { AppSettingsProvider, useAppSettings } from '../contexts/AppSettingsContext';
import { TypingSessionProvider, useTypingSession } from '../contexts/TypingSessionContext';
import { KeyboardHighlightProvider } from '../contexts/KeyboardHighlightContext';

interface TouchTypistProps {}

// Core typing game UI component that coordinates between contexts and child components
const TouchTypistInner: React.FC = () => {
  // Access settings and session state from contexts
  const { level, selectedLayout, shiftMode } = useAppSettings();
  const { wordsState, submitWord, initializeSession, currentWPM } = useTypingSession();

  // Initialize typing session on mount and regenerate when user manually changes settings
  useEffect(() => {
    initializeSession();
  }, [selectedLayout, shiftMode, initializeSession]); // Runs on mount + when layout/shift changes

  return (
    <div className="app-container">
      <div className="about-box">
        TouchTypist by Adam Peterson<br />
        <a href="https://github.com/alphaetapi-ai/touch-typist" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <div className="level-display">Level: {level} | Speed: {currentWPM.toFixed(1)} WPM</div>
      <TouchTypistControls />
      <PendingWords wordsState={wordsState} />

      <TypingBox
        onWordSubmit={submitWord}
        currentWord={wordsState.current}
      />

      <KeyboardGrid />
    </div>
  );
};

// UI controls for level adjustment, layout selection, and shift mode toggle
const TouchTypistControls: React.FC = () => {
  const { level, selectedLayout, shiftMode, handleLevelChange, handleLayoutChange, handleShiftChange } = useAppSettings();
  const { initializeSession } = useTypingSession();

  // Handler for manual level changes that also regenerates words
  const handleManualLevelChange = (newLevel: number) => {
    handleLevelChange(newLevel);
    initializeSession(newLevel); // Pass the new level to avoid stale state
  };

  return (
    <div className="controls">
      <button
        onClick={() => handleManualLevelChange(level - 1)}
        disabled={level <= 1}
      >
        -1
      </button>
      <button
        onClick={() => handleManualLevelChange(level + 1)}
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
  );
};

// Root TouchTypist component that provides all contexts to child components
export const TouchTypist: React.FC<TouchTypistProps> = () => {
  return (
    <AppSettingsProvider>
      <TypingSessionProvider>
        <KeyboardHighlightProvider>
          <TouchTypistInner />
        </KeyboardHighlightProvider>
      </TypingSessionProvider>
    </AppSettingsProvider>
  );
};