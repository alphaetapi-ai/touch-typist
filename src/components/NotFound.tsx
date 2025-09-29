import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="app-container">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404 - Page Not Found</h1>
          <p>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="back-link">
              ← Back to Touch Typist
            </Link>
            <Link to="/instructions" className="instructions-link">
              View Instructions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};