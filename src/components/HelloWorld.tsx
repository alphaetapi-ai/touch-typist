import React from 'react';

interface HelloWorldProps {}

export const HelloWorld: React.FC<HelloWorldProps> = () => {
  return (
    <div className="hello-world-container">
      <h1 className="hello-world-heading">Hello World!</h1>
    </div>
  );
};