import { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  className?: string;
}

export function Timer({ duration, onComplete, className = '' }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining, onComplete]);

  // Format the time remaining as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate percentage of time remaining
  const percentage = Math.floor((timeRemaining / duration) * 100);
  
  // Determine color based on percentage
  let colorClass = 'bg-green-500';
  if (percentage < 50) colorClass = 'bg-yellow-500';
  if (percentage < 20) colorClass = 'bg-red-500';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-sm font-medium">{formattedTime}</div>
    </div>
  );
}