import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TouchTypist } from './components/TouchTypist';
import { Instructions } from './components/Instructions';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TouchTypist />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);