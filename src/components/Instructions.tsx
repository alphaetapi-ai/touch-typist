import React from 'react';
import { Link } from 'react-router-dom';

export const Instructions: React.FC = () => {
  return (
    <div className="app-container">
      <div className="instructions-container">
        <header className="instructions-header">
          <h1>TouchTypist Instructions</h1>
          <Link to="/" className="back-link">← Back to Typing Tutor</Link>
        </header>

        <section className="instructions-section">
          <h2>How to Use TouchTypist</h2>
          <p>
            TouchTypist is a progressive typing tutor that teaches you to touch type by gradually
            introducing new keys based on your speed and accuracy. Start at Level 1 and work your
            way up to Level 25 for complete keyboard mastery.
          </p>
        </section>

        <section className="instructions-section">
          <h2>Getting Started</h2>
          <ol>
            <li><strong>Start Typing:</strong> Click in the text input box and begin typing the displayed word</li>
            <li><strong>Word Completion:</strong> Press <kbd>Space</kbd> or <kbd>Enter</kbd> when you finish each word</li>
            <li><strong>Automatic Progression:</strong> When your speed reaches 12+ WPM consistently, you'll advance to the next level</li>
            <li><strong>Manual Controls:</strong> Use the +1/-1 buttons to manually adjust your level if needed</li>
          </ol>
        </section>

        <section className="instructions-section">
          <h2>Keyboard Layouts</h2>
          <ul>
            <li><strong>QWERTY:</strong> Standard US keyboard layout</li>
            <li><strong>Dvorak:</strong> Alternative layout optimized for efficiency</li>
          </ul>
          <p>Choose your preferred layout from the dropdown menu. The virtual keyboard will update to match your selection.</p>
        </section>

        <section className="instructions-section">
          <h2>Shift Mode</h2>
          <p>
            Enable "Shift Mode" to practice symbols and alternate characters accessed with the Shift key.
            This includes punctuation marks and special symbols, making your typing practice more comprehensive.
            Note that capital letters are not included in the practice words.
          </p>
        </section>

        <section className="instructions-section">
          <h2>Visual Feedback</h2>
          <ul>
            <li><strong>Keyboard Highlighting:</strong> The next key to press is highlighted on the virtual keyboard</li>
            <li><strong>Home Row Keys:</strong> Keys on the home row (ASDF JKL;) are shown with darker borders</li>
            <li><strong>Active Keys:</strong> Keys available at your current level are visually distinct from inactive ones</li>
            <li><strong>Speed Display:</strong> Your current Words Per Minute (WPM) is shown in real-time</li>
          </ul>
        </section>

        <section className="instructions-section">
          <h2>Level Progression</h2>
          <p>
            TouchTypist uses a 25-level system that gradually introduces new keys:
          </p>
          <ul>
            <li><strong>Levels 1-4:</strong> Home row keys (ASDF JKL;)</li>
            <li><strong>Levels 5-12:</strong> Upper and lower rows</li>
            <li><strong>Levels 13-20:</strong> Numbers and common symbols</li>
            <li><strong>Levels 21-25:</strong> Advanced symbols and complete keyboard</li>
          </ul>
          <p>
            Each level focuses on keys that are typically learned together, following established
            touch typing pedagogy. You'll automatically advance when your typing speed improves.
          </p>
        </section>

        <section className="instructions-section">
          <h2>Tips for Success</h2>
          <ul>
            <li><strong>Proper Posture:</strong> Sit up straight with feet flat on the floor</li>
            <li><strong>Hand Position:</strong> Keep your fingers on the home row when not typing</li>
            <li><strong>Look at Screen:</strong> Don't look at your hands or the keyboard</li>
            <li><strong>Accuracy First:</strong> Focus on accuracy before speed - speed will come naturally</li>
            <li><strong>Regular Practice:</strong> Short, frequent sessions are more effective than long ones</li>
            <li><strong>Use All Fingers:</strong> Make sure each finger is responsible for its designated keys</li>
          </ul>
        </section>

        <section className="instructions-section">
          <h2>Troubleshooting</h2>
          <dl>
            <dt>I'm not advancing to the next level</dt>
            <dd>Make sure you're consistently typing above 12 WPM. You can also manually advance with the +1 button.</dd>

            <dt>The keyboard highlighting isn't working</dt>
            <dd>Make sure you're typing in the input box. The highlighting shows the next character you need to type.</dd>

            <dt>I want to practice specific keys</dt>
            <dd>Use the manual level controls to focus on levels that emphasize the keys you want to practice.</dd>

            <dt>My typing speed seems inconsistent</dt>
            <dd>The speed calculation uses a rolling average. Focus on consistent, accurate typing rather than rushing.</dd>
          </dl>
        </section>

        <footer className="instructions-footer">
          <p>
            <strong>Ready to start?</strong> <Link to="/">Go to the typing tutor</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};