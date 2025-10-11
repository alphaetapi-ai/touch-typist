import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TouchTypist } from './components/TouchTypist';
import { Instructions } from './components/Instructions';
import { NotFound } from './components/NotFound';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import { WordCacheProvider } from './contexts/WordCacheContext';
import { TypingSessionProvider } from './contexts/TypingSessionContext';
import { KeyboardHighlightProvider } from './contexts/KeyboardHighlightContext';

const App: React.FC = () => {
  return (
    <AppSettingsProvider>
      <WordCacheProvider>
        <TypingSessionProvider>
          <KeyboardHighlightProvider>
            <Router>
              <Routes>
                <Route path="/" element={<TouchTypist />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </KeyboardHighlightProvider>
        </TypingSessionProvider>
      </WordCacheProvider>
    </AppSettingsProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);