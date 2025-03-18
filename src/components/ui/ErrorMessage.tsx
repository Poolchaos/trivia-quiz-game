interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`bg-red-50 border-l-4 border-red-500 p-4 text-red-700 ${className}`}
      role="alert"
    >
      <p className="font-medium">Error</p>
      <p>{message}</p>
    </div>
  );
}