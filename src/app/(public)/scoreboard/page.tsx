import PublicScoreboard from '@/components/scoreboard/PublicScoreboard'

export default function ScoreboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4">
        <PublicScoreboard />
      </div>
    </div>
  );
}