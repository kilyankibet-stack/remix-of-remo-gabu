import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import moneyBag from '@/assets/money-bag.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center animate-scale-in">
        {/* Logo */}
        <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 mt-8 shimmer">
          <img src={moneyBag} alt="REMO-TASK" width={64} height={64} className="drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-black tracking-wide gradient-text-primary">REMO-TASK</h1>
        <p className="text-accent-foreground text-sm mt-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Earn Money by Training AI
        </p>

        {/* Welcome Card */}
        <div className="w-full glass rounded-2xl p-6 mt-8 border border-border/50">
          <h2 className="text-lg font-bold text-foreground text-center">Welcome to the Future of Earning</h2>
          <p className="text-muted-foreground text-sm text-center mt-3 leading-relaxed">
            Complete simple AI training tasks and earn real money.
            Flexible work hours, instant payments via M-Pesa, and
            unlimited earning potential. Join thousands of earners today!
          </p>
        </div>

        {/* Features */}
        <div className="w-full space-y-2.5 mt-4">
          <Feature icon="📝" title="Easy Tasks" desc="Text annotation, classification, and more" delay={0} />
          <Feature icon="💵" title="Instant Payments" desc="Withdraw earnings directly to M-Pesa" delay={1} />
          <Feature icon="🌍" title="Work Anywhere" desc="Complete tasks on your phone anytime" delay={2} />
          <Feature icon="🎁" title="Welcome Bonus" desc="Get up to KES 600 bonus when you sign up!" delay={3} />
        </div>

        {/* Terms */}
        <label className="flex items-center gap-3 w-full glass rounded-xl p-4 mt-4 border border-border/50 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
          <span className="text-sm text-muted-foreground">I agree to the Terms & Conditions and Privacy Policy</span>
        </label>

        {/* Buttons */}
        <button
          onClick={() => navigate('/register')}
          className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-xl mt-6 text-lg glow-primary flex items-center justify-center gap-2 card-hover"
        >
          Create Account <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full border border-primary/40 text-accent-foreground font-semibold py-4 rounded-xl mt-3 text-lg hover:bg-primary/10 transition-colors"
        >
          Already Have Account? Sign In
        </button>

        <p className="text-muted-foreground text-xs mt-6 mb-4">Version 1.0 • Powered by AI</p>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) => (
  <div className="flex items-center gap-4 glass rounded-xl p-4 border border-border/50 card-hover"
    style={{ animationDelay: `${delay * 0.1}s` }}>
    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-muted-foreground text-xs">{desc}</p>
    </div>
  </div>
);

export default Landing;
