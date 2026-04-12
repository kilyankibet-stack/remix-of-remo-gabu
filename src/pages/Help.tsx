import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, LogOut } from 'lucide-react';

const faqs = [
  { q: 'How do I earn money?', a: 'Complete AI training tasks and surveys available on your dashboard. Each task pays between $1.50 - $5.00 depending on difficulty. Start with the free Data Categorization task to get familiar with the platform.' },
  { q: 'How do I withdraw funds?', a: 'Click the Withdraw button on your dashboard. Select your preferred method (M-Pesa, Bank Transfer, or Crypto), enter your details, and submit. You need a paid account plan to process withdrawals.' },
  { q: 'What payment methods are available?', a: 'We support M-Pesa (instant transfer), Bank Transfer (2-5 business days), and Cryptocurrency including Bitcoin, USDT, Ethereum, and Litecoin. PayPal support is coming soon.' },
  { q: 'How do I upgrade my account?', a: 'Click the Upgrade button on your dashboard. We offer four plans: Beginner ($3), Average ($5), Expert ($8), and Elite ($13). Each plan unlocks more tasks and higher earning potential.' },
  { q: 'Is the $10 welcome bonus real?', a: 'Yes! Every new user receives a $10 welcome bonus credited immediately after completing the initial assessment. This bonus is added to your available balance.' },
  { q: 'How many tasks can I do per day?', a: 'There is no daily limit on tasks. You can complete as many surveys as available. New tasks are added regularly across all categories.' },
  { q: 'What happens if I fail the assessment?', a: 'Don\'t worry! You still receive the $10 welcome bonus regardless of your assessment score. The assessment helps us understand your skill level for task matching.' },
  { q: 'How long does M-Pesa withdrawal take?', a: 'M-Pesa withdrawals are processed instantly. You should receive your funds within 1-2 minutes after approval.' },
  { q: 'Can I use the platform on mobile?', a: 'Yes! Our platform is fully optimized for mobile devices. You can complete tasks, withdraw funds, and manage your account from any smartphone.' },
  { q: 'How do I contact support?', a: 'You can reach our support team at support@remotask.com. We typically respond within 24 hours on business days.' },
];

const Help = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
            <p className="text-muted-foreground text-xs">Find answers to common questions</p>
          </div>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl border border-border/50 overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-secondary/30"
              >
                <p className="text-foreground font-semibold text-sm flex-1 pr-3">{faq.q}</p>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${openIndex === i ? 'bg-primary/20' : 'bg-secondary'}`}>
                  {openIndex === i
                    ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
                    : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  }
                </div>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 pt-0 animate-scale-in">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <p className="text-foreground font-semibold text-sm">Still need help?</p>
          </div>
          <p className="text-muted-foreground text-sm mb-4">Contact our support team for personalized assistance.</p>
          <a href="mailto:support@remotask.com" className="w-full block text-center gradient-primary text-primary-foreground font-semibold py-3 rounded-xl text-sm transition-transform active:scale-[0.98]">
            📧 Email Support
          </a>
        </div>

        <button onClick={handleLogout} className="w-full mt-4 glass border border-destructive/20 text-destructive font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:bg-destructive/10 active:scale-[0.98]">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Help;
