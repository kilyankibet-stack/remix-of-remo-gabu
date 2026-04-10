import { useUserStore } from '@/store/userStore';
import BottomNav from '@/components/BottomNav';

const allRewards: Record<string, number> = {
  'data-cat': 2.15, 'pattern': 3.15, 'sentence': 1.80, 'image': 1.88,
  'sentiment': 2.30, 'code-review': 2.55, 'translation': 2.12, 'refer': 2.35,
  'audio-transcript': 2.75, 'fact-check': 3.00, 'content-mod': 2.10, 'data-entry': 1.65,
  'text-summary': 2.80, 'email-class': 2.05, 'product-cat': 2.25, 'grammar': 1.95,
  'spam-detect': 2.15, 'ad-relevance': 2.40, 'search-quality': 2.60, 'video-tag': 2.50,
  'resume-screen': 2.95, 'legal-review': 3.30, 'map-valid': 2.00, 'weather-data': 1.85,
  'social-analysis': 2.65, 'support-qa': 2.30, 'accessibility': 2.85, 'uiux-review': 2.75,
  'math-verify': 3.05, 'science-fact': 3.15,
};

const Earnings = () => {
  const { balance, completedSurveys, bonusClaimed } = useUserStore();

  const earningHistory = [
    ...(bonusClaimed ? [{ label: 'Welcome Bonus', amount: 10.00, date: 'Today' }] : []),
    ...completedSurveys.map((id) => ({
      label: `Survey: ${id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      amount: allRewards[id] || 2.00,
      date: 'Today',
    })),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-md mx-auto px-4 py-5">
        <h1 className="text-xl font-bold text-foreground mb-4">Earnings</h1>

        <div className="bg-card rounded-xl p-5 border border-border mb-5">
          <p className="text-muted-foreground text-xs">Total Earnings</p>
          <p className="text-3xl font-black text-success">${balance.toFixed(2)}</p>
        </div>

        <h2 className="text-foreground font-semibold text-sm mb-2">History</h2>
        {earningHistory.length === 0 ? (
          <p className="text-muted-foreground text-xs">No earnings yet. Start completing surveys!</p>
        ) : (
          <div className="space-y-2">
            {earningHistory.map((e, i) => (
              <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-foreground text-xs font-medium">{e.label}</p>
                  <p className="text-muted-foreground text-[10px]">{e.date}</p>
                </div>
                <p className="text-success font-bold text-xs">+${e.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Earnings;
