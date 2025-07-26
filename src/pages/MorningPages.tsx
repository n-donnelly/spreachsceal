import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import './MorningPages.css';

const MorningPages: React.FC = () => {
  const [text, setText] = useState('');
  const [isFading, setIsFading] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsFading(true);
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.innerText = '';
        }
        setIsFading(false);
      }, 1000);
    }
  };

  return (
    <div className="morning-pages-container">
      <h1>Morning Pages</h1>
      <p className="description">
        Write freely. Press Enter to let your thoughts fade away.
      </p>
      <div className="morning-pages-textarea">
        <div
          ref={editableRef}
          className={`editable-content ${isFading ? 'fade-out' : ''}`}
          contentEditable
          onKeyDown={handleKeyPress}
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
};

export default MorningPages;