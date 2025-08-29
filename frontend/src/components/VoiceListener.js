import React, { useRef, useEffect } from 'react';

export default function VoiceListener({ onTrigger, setFeedback, setOpen }) {
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setFeedback && setFeedback("Voice recognition not supported.");
      setOpen && setOpen(true);
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = 'en-US';
    recognition.current.interimResults = false;

    recognition.current.onresult = (event) => {
      for (let i = 0; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (transcript.includes('help') || transcript.includes('sos')) {
          onTrigger();
          setFeedback && setFeedback('Voice-detected SOS! Your emergency contacts have been notified.');
          setOpen && setOpen(true);
          break;
        }
      }
    };

    recognition.current.onend = () => {
      try {
        recognition.current.start();
      } catch (e) {
        if (e.name !== 'InvalidStateError') {
          console.error('Speech recognition error on restart:', e);
        }
      }
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.current.start();

    return () => {
      recognition.current && recognition.current.stop();
    };
  }, [onTrigger, setFeedback, setOpen]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 220,
      right: 100,
      backgroundColor: '#fbb56a88',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      boxShadow: '0 2px 12px #6a82fb88',
      userSelect: 'none',
      pointerEvents: 'none',
      zIndex: 1200
    }}>
      Listening for 'help' / 'SOS'
    </div>
  );
}
