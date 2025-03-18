import { Container } from '@/components/layout/Container';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Button } from '@/components/ui/Button';

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  return (
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Top Scores</h1>
          <Button onClick={onBack} variant="secondary">
            Back to Home
          </Button>
        </div>
        
        <Leaderboard />
      </div>
    </Container>
  );
}