import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import trophy from '@/assets/trophy.png';
import { CheckCircle2 } from 'lucide-react';

const Bonus = () => {
  const navigate = useNavigate();
  const { claimBonus, bonusClaimed } = useUserStore();

  const handleClaim = () => {
    if (!bonusClaimed) claimBonus();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl p-8 border border-border flex flex-col items-center">
          <img src={trophy} alt="Trophy" width={80} height={80} />
          <span className="inline-block bg-success/20 text-success px-4 py-1 rounded-full text-xs font-bold mt-4">🎉 CONGRATULATIONS</span>
          <h1 className="text-2xl font-bold text-foreground mt-3">Welcome Bonus</h1>

          <div className="w-full bg-secondary rounded-xl p-6 mt-4 text-center">
            <p className="text-accent-foreground text-sm">You've earned</p>
            <p className="text-5xl font-black text-success mt-1">$10.00</p>
          </div>

          <p className="text-muted-foreground text-sm mt-4">Will be credited to your available balance</p>

          <div className="w-full mt-4 space-y-2">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-foreground text-sm font-medium">Available for instant use</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-foreground text-sm font-medium">No withdrawal maximum</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-foreground text-sm font-medium">Start earning immediately</span></div>
          </div>

          <button onClick={handleClaim} className="w-full gradient-success text-success-foreground font-semibold py-4 rounded-xl mt-6 text-lg glow-success">
            Claim & Continue →
          </button>
        </div>
        <p className="text-muted-foreground text-xs text-center mt-4">🔒 Secure • Instant • Guaranteed • One-Time Offer</p>
      </div>
    </div>
  );
};

export default Bonus;
