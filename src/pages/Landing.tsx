import { useNavigate } from 'react-router-dom';
import moneyBag from '@/assets/money-bag.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="w-28 h-28 rounded-2xl bg-primary/30 flex items-center justify-center mb-4 mt-8">
          <img src={moneyBag} alt="REMO-TASK" width={80} height={80} />
        </div>
        <h1 className="text-3xl font-black tracking-wide text-foreground">REMO-TASK</h1>
        <p className="text-accent-foreground text-sm mt-1">Earn Money by Training AI</p>

        {/* Welcome Card */}
        <div className="w-full bg-card rounded-xl p-6 mt-8 border border-border">
          <h2 className="text-lg font-bold text-foreground text-center">Welcome to the Future of Earning</h2>
          <p className="text-muted-foreground text-sm text-center mt-3 leading-relaxed">
            Complete simple AI training tasks and earn real money.
            Flexible work hours, instant payments via M-Pesa, and
            unlimited earning potential. Join thousands of earners today!
          </p>
        </div>

        {/* Features */}
        <div className="w-full bg-card rounded-xl p-5 mt-4 border border-border space-y-4">
          <Feature icon="📝" title="Easy Tasks" desc="Text annotation, classification, and more" />
          <Feature icon="💵" title="Instant Payments" desc="Withdraw earnings directly to M-Pesa" />
          <Feature icon="🌍" title="Work Anywhere" desc="Complete tasks on your phone anytime" />
          <Feature icon="🎁" title="Welcome Bonus" desc="Get up to KES 600 bonus when you sign up!" />
        </div>

        {/* Terms */}
        <label className="flex items-center gap-3 w-full bg-card rounded-xl p-4 mt-4 border border-border cursor-pointer">
          <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
          <span className="text-sm text-muted-foreground">I agree to the Terms & Conditions and Privacy Policy</span>
        </label>

        {/* Buttons */}
        <button
          onClick={() => navigate('/register')}
          className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-xl mt-6 text-lg glow-primary"
        >
          Create Account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full border border-primary text-accent-foreground font-semibold py-4 rounded-xl mt-3 text-lg"
        >
          Already Have Account? Sign In
        </button>

        <p className="text-muted-foreground text-xs mt-6">Version 1.0 • Powered by AI</p>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex items-center gap-4">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-muted-foreground text-xs">{desc}</p>
    </div>
  </div>
);

export default Landing;
