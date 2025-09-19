import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelloWorld } from './components/HelloWorld';

const App: React.FC = () => {
  return <HelloWorld />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);