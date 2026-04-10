import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct = 6, total = 6 } = (location.state as any) || {};
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-success flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-success-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center">Congratulations!</h1>
        <h2 className="text-2xl font-bold text-foreground text-center">Screening Passed!</h2>

        <div className="w-full bg-card rounded-xl p-6 mt-8 border border-success/30">
          <p className="text-muted-foreground text-center text-sm">Your Score</p>
          <p className="text-5xl font-black text-success text-center mt-2">{pct}%</p>
          <p className="text-muted-foreground text-center text-sm mt-2">{correct} out of {total} questions correct</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-success text-sm font-semibold">Qualified for AI Training Tasks</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/bonus')}
          className="w-full gradient-success text-success-foreground font-semibold py-4 rounded-xl mt-8 text-lg glow-success"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default Results;
