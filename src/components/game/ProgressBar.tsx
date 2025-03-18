interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.floor((current / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1 text-sm text-gray-500">
        <span>Question {current} of {total}</span>
        <span>{percentage}% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}