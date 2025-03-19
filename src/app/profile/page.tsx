'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatDate } from '@/utils/index';

interface UserScore {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is not authenticated, redirect to sign in
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    
    // Fetch user scores if authenticated
    if (status === 'authenticated' && session.user) {
      fetchUserScores();
    }
  }, [status, session, router]);

  const fetchUserScores = async () => {
    try {
      // This would be an actual API call in a real application
      // For now, we'll mock the data
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockScores: UserScore[] = [
        {
          id: '1',
          score: 8,
          totalQuestions: 10,
          percentage: 80,
          timeTaken: 120,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          score: 6,
          totalQuestions: 10,
          percentage: 60,
          timeTaken: 180,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
      ];
      
      setUserScores(mockScores);
    } catch (error) {
      console.error('Error fetching user scores:', error);
      setError('Failed to fetch your quiz history');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container className="py-12">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userScores.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {userScores.length > 0
                  ? `${Math.round(
                      userScores.reduce((sum, score) => sum + score.percentage, 0) / userScores.length
                    )}%`
                  : '0%'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {userScores.length > 0
                  ? `${Math.round(
                      Math.max(...userScores.map(score => score.percentage))
                    )}%`
                  : '0%'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <ErrorMessage message={error} />
            ) : userScores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven&apos;t taken any quizzes yet.</p>
                <Button onClick={() => router.push('/')}>
                  Start Your First Quiz
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-semibold text-gray-900">Date</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">Score</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">Time</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userScores.map((score) => (
                      <tr key={score.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap">
                          {formatDate(new Date(score.createdAt))}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="font-medium text-gray-900">{score.score}/{score.totalQuestions}</div>
                          <div className="text-sm text-gray-500">{Math.round(score.percentage)}%</div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap text-gray-500">
                          {Math.floor(score.timeTaken / 60)}:{(score.timeTaken % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              // View details functionality would go here
                              alert('View details for quiz ' + score.id);
                            }}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}