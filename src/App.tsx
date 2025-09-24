import React from 'react';
import ReactDOM from 'react-dom/client';
import { TouchTypist } from './components/TouchTypist';

const App: React.FC = () => {
  return <TouchTypist />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);