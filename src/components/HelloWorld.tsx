import React from 'react';

interface HelloWorldProps {}

export const HelloWorld: React.FC<HelloWorldProps> = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      fontSize: '2rem',
      color: '#333'
    }}>
      <h1>Hello World!</h1>
    </div>
  );
};