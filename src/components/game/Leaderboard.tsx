import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatTime } from '@/utils/quizUtils';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  createdAt: string;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch leaderboard');
        }

        setLeaderboard(data.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No scores yet. Be the first to play!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">Player</th>
                  <th className="py-2 px-4 text-right">Score</th>
                  <th className="py-2 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </td>
                    <td className="py-2 px-4 font-medium">{entry.username}</td>
                    <td className="py-2 px-4 text-right">
                      {entry.score}/{entry.totalQuestions} 
                      <span className="text-gray-500 ml-1">
                        ({Math.round(entry.percentage)}%)
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">{formatTime(entry.timeTaken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}