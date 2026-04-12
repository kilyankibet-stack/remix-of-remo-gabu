import { useUserStore } from '@/store/userStore';
import BottomNav from '@/components/BottomNav';
import { TrendingUp, Award } from 'lucide-react';

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
    ...(bonusClaimed ? [{ label: 'Welcome Bonus', amount: 10.00, date: 'Today', icon: '🎁' }] : []),
    ...completedSurveys.map((id) => ({
      label: `${id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      amount: allRewards[id] || 2.00,
      date: 'Today',
      icon: '✅',
    })),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-md mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Earnings</h1>
            <p className="text-muted-foreground text-xs">{completedSurveys.length} tasks completed</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-border/50 mb-5 shimmer">
          <p className="text-muted-foreground text-xs">Total Earnings</p>
          <p className="text-4xl font-black gradient-text-success mt-1">${balance.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-3">
            <Award className="w-4 h-4 text-primary" />
            <p className="text-muted-foreground text-[11px]">{earningHistory.length} transactions</p>
          </div>
        </div>

        <h2 className="text-foreground font-semibold text-sm mb-3">History</h2>
        {earningHistory.length === 0 ? (
          <div className="glass rounded-2xl p-8 border border-border/50 text-center">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-muted-foreground text-sm">No earnings yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Start completing tasks to earn!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {earningHistory.map((e, i) => (
              <div key={i} className="glass rounded-xl p-3.5 border border-border/50 flex items-center justify-between card-hover">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center">
                    <span className="text-sm">{e.icon}</span>
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-medium">{e.label}</p>
                    <p className="text-muted-foreground text-[10px]">{e.date}</p>
                  </div>
                </div>
                <p className="text-success font-bold text-sm">+${e.amount.toFixed(2)}</p>
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
