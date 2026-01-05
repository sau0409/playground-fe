import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Determine button state and icon
  const getButtonContent = () => {
    if (time === 0) {
      return { text: '▶', label: 'Play', color: 'bg-green-600 hover:bg-green-700' };
    } else if (isRunning) {
      return { text: '⏸', label: 'Pause', color: 'bg-yellow-600 hover:bg-yellow-700' };
    } else {
      return { text: '▶', label: 'Play', color: 'bg-green-600 hover:bg-green-700' };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md">
      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Timer:</span>
      <span className="text-base font-mono font-semibold text-gray-800 dark:text-gray-200 min-w-[50px]">
        {formatTime(time)}
      </span>
      <button
        onClick={handleToggle}
        className={`px-2 py-1 ${buttonContent.color} text-white rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors`}
        title={buttonContent.label}
      >
        {buttonContent.text}
      </button>
      <button
        onClick={handleReset}
        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
        title="Reset"
      >
        ↻
      </button>
    </div>
  );
}

