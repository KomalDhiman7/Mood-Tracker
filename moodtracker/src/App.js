import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import { motion } from 'framer-motion';

const moodColors = {
  '😊': '#ffe066',
  '😔': '#748ffc',
  '😡': '#ff6b6b',
  '😴': '#a29bfe',
  '😐': '#dfe6e9',
  '😭': '#fab1a0',
};

function App() {
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('moodHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [violetMode, setVioletMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const onDateClick = (date) => {
    if (!selectedMood) return;
    const dateStr = date.toDateString();
    setMoodHistory((prev) => ({
      ...prev,
      [dateStr]: selectedMood,
    }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(moodHistory)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mood-history.json';
    link.click();
  };

  const resetMoodHistory = () => {
    if (window.confirm("Are you sure you want to erase all your moods? This can’t be undone!")) {
      setMoodHistory({});
      localStorage.removeItem('moodHistory');
    }
  };

  const toggleVioletMode = () => {
    setVioletMode((prev) => !prev);
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const mood = moodHistory[date.toDateString()];
    if (!mood) return null;

    return (
      <motion.div
        className="mood-dot"
        style={{ backgroundColor: moodColors[mood] }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
      />
    );
  };

  const moodStats = Object.values(moodHistory).reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`App ${violetMode ? 'violet-theme' : ''}`}>
      <h1>Mood Tracker 😌</h1>

      {/* 💜 Violet Mode Toggle */}
      <button onClick={toggleVioletMode} className="dark-toggle">
        {violetMode ? '🌞 Light Mode' : '💜 Dark Mode'}
      </button>

      
      <div className="emoji-row">
        {Object.keys(moodColors).map((emoji) => (
          <motion.button
            key={emoji}
            onClick={() => setSelectedMood(emoji)}
            className={selectedMood === emoji ? 'selected' : ''}
            whileHover={{ scale: 1.3 }}
            animate={{ scale: selectedMood === emoji ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

     
      <div className="calendar-wrapper">
        <Calendar
          onClickDay={onDateClick}
          tileContent={tileContent}
          navigationLabel={({ date }) => (
            <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
          )}
        />
      </div>

  
      <div className="stats">
        <h2>Your Mood Stats</h2>
        {Object.entries(moodStats).length === 0 && (
          <p>No moods tracked yet. Click an emoji and a day!</p>
        )}
        <ul>
          {Object.entries(moodStats).map(([mood, count]) => (
            <li key={mood} style={{ color: moodColors[mood], fontWeight: 'bold' }}>
              {mood} — {count} day{count > 1 ? 's' : ''}
            </li>
          ))}
        </ul>

        <div className="button-row">
  <button onClick={exportData} className="export-btn">
    📦 Export Mood Data
  </button>
  <button onClick={resetMoodHistory} className="export-btn reset-btn">
    🔄 Reset Data
  </button>
</div>

      </div>
    </div>
  );
}

export default App;
