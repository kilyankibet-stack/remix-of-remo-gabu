import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import BottomNav from '@/components/BottomNav';
import PlansModal from '@/components/PlansModal';
import WithdrawModal from '@/components/WithdrawModal';
import ProfileModal from '@/components/ProfileModal';
import { Bell, CheckSquare, TrendingUp, Clock, Users, Wallet } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const allWithdrawals = [
  { phone: '+254798****123', amount: 37.20, time: '34s ago' },
  { phone: '+254712****456', amount: 22.50, time: '1m ago' },
  { phone: '+254700****789', amount: 15.80, time: '2m ago' },
  { phone: '+254733****012', amount: 45.00, time: '3m ago' },
  { phone: '+254711****345', amount: 18.90, time: '5m ago' },
  { phone: '+254722****678', amount: 29.60, time: '8m ago' },
  { phone: '+254745****901', amount: 52.30, time: '12m ago' },
  { phone: '+254701****234', amount: 11.40, time: '15m ago' },
];

const taskCategories = [
  { id: 'data-cat', title: 'Data Categorization', desc: 'Organize data into structured groups', pay: '$1.85 – 2.50/task' },
  { id: 'pattern', title: 'Pattern Recognition', desc: 'Identify data patterns in datasets', pay: '$2.70 – 3.65/task' },
  { id: 'sentence', title: 'Sentence Arrangement', desc: 'Arrange text in logical order', pay: '$1.55 – 2.09/task' },
  { id: 'refer', title: 'Refer & Earn', desc: 'Invite friends for bonus rewards', pay: '$2.00 – 2.70/task' },
  { id: 'image', title: 'Image Labeling', desc: 'Label images for ML training', pay: '$1.60 – 2.16/task' },
  { id: 'sentiment', title: 'Sentiment Analysis', desc: 'Classify text sentiment', pay: '$1.95 – 2.63/task' },
  { id: 'code-review', title: 'Code Review', desc: 'Evaluate code quality', pay: '$2.10 – 3.00/task' },
  { id: 'translation', title: 'Translation Task', desc: 'Translate content accurately', pay: '$1.80 – 2.45/task' },
  { id: 'audio-transcript', title: 'Audio Transcription', desc: 'Transcribe audio to text', pay: '$2.20 – 3.10/task' },
  { id: 'fact-check', title: 'Fact Checking', desc: 'Verify claims and statements', pay: '$2.40 – 3.50/task' },
  { id: 'content-mod', title: 'Content Moderation', desc: 'Review content for guidelines', pay: '$1.70 – 2.30/task' },
  { id: 'data-entry', title: 'Data Entry', desc: 'Input structured data accurately', pay: '$1.50 – 2.00/task' },
  { id: 'text-summary', title: 'Text Summarization', desc: 'Summarize lengthy documents', pay: '$2.30 – 3.20/task' },
  { id: 'email-class', title: 'Email Classification', desc: 'Categorize emails by intent', pay: '$1.75 – 2.40/task' },
  { id: 'product-cat', title: 'Product Categorization', desc: 'Classify products for e-commerce', pay: '$1.90 – 2.60/task' },
  { id: 'grammar', title: 'Grammar Correction', desc: 'Fix grammar and punctuation errors', pay: '$1.65 – 2.25/task' },
  { id: 'spam-detect', title: 'Spam Detection', desc: 'Identify spam messages', pay: '$1.80 – 2.50/task' },
  { id: 'ad-relevance', title: 'Ad Relevance', desc: 'Rate ad targeting quality', pay: '$2.00 – 2.80/task' },
  { id: 'search-quality', title: 'Search Quality', desc: 'Evaluate search result relevance', pay: '$2.15 – 3.00/task' },
  { id: 'video-tag', title: 'Video Tagging', desc: 'Tag and categorize video content', pay: '$2.10 – 2.90/task' },
  { id: 'resume-screen', title: 'Resume Screening', desc: 'Evaluate candidate qualifications', pay: '$2.50 – 3.40/task' },
  { id: 'legal-review', title: 'Legal Review', desc: 'Analyze legal document clauses', pay: '$2.80 – 3.80/task' },
  { id: 'map-valid', title: 'Map Validation', desc: 'Verify map data accuracy', pay: '$1.70 – 2.35/task' },
  { id: 'weather-data', title: 'Weather Data', desc: 'Classify weather observations', pay: '$1.55 – 2.15/task' },
  { id: 'social-analysis', title: 'Social Media Analysis', desc: 'Analyze social media trends', pay: '$2.20 – 3.10/task' },
  { id: 'support-qa', title: 'Customer Support QA', desc: 'Rate support response quality', pay: '$1.90 – 2.70/task' },
  { id: 'accessibility', title: 'Accessibility Audit', desc: 'Evaluate web accessibility', pay: '$2.40 – 3.30/task' },
  { id: 'uiux-review', title: 'UI/UX Review', desc: 'Review user interface designs', pay: '$2.30 – 3.20/task' },
  { id: 'math-verify', title: 'Math Verification', desc: 'Verify mathematical solutions', pay: '$2.60 – 3.50/task' },
  { id: 'science-fact', title: 'Science Fact Check', desc: 'Verify scientific claims', pay: '$2.70 – 3.60/task' },
];

const Dashboard = () => {
  const { fullName, balance, accountType, completedSurveys, showWithdrawModal, setShowWithdrawModal } = useUserStore();
  const navigate = useNavigate();
  const [showPlans, setShowPlans] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentWithdrawal, setCurrentWithdrawal] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const firstName = fullName.split(' ')[0] || 'User';

  useEffect(() => {
    if (showWithdrawModal) {
      setShowWithdraw(true);
      setShowWithdrawModal(false);
    }
  }, [showWithdrawModal, setShowWithdrawModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentWithdrawal((prev) => (prev + 1) % allWithdrawals.length);
        setFadeIn(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const w = allWithdrawals[currentWithdrawal];
  const isCompleted = (taskId: string) => completedSurveys.includes(taskId);
  const canAccessSurvey = (taskId: string) => {
    if (isCompleted(taskId)) return false;
    if (accountType !== 'free') return true;
    if (completedSurveys.length === 0 && taskId === 'data-cat') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs">R</span>
            </div>
            <span className="text-foreground font-bold text-sm tracking-wide">REMOTASK</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>
            <button onClick={() => setShowProfile(true)} className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center transition-transform active:scale-95">
              <span className="text-accent-foreground font-bold text-[10px]">{firstName[0]}{fullName.split(' ')[1]?.[0] || ''}</span>
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-xs">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{firstName} 👋</h1>
          </div>
          <CheckSquare className="w-5 h-5 text-success" />
        </div>

        {/* Balance Card */}
        <div className="glass rounded-2xl p-5 border border-border/50 mb-4 shimmer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Available Balance
              </p>
              <p className="text-3xl font-black gradient-text-success mt-1">${balance.toFixed(2)}</p>
            </div>
            <button onClick={() => setShowWithdraw(true)} className="gradient-success text-success-foreground px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-lg glow-success transition-transform active:scale-95">
              💸 Withdraw
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCard icon={<TrendingUp className="w-3.5 h-3.5 text-primary" />} label="Tasks" value="400+" />
          <StatCard icon={<Clock className="w-3.5 h-3.5 text-warning" />} label="Available" value="24 hrs" />
          <StatCard icon={<Users className="w-3.5 h-3.5 text-success" />} label="Active" value="1,205" />
        </div>

        {/* Live Withdrawals */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span>🌍</span>
            <span className="text-foreground font-semibold text-xs">Live Withdrawals</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" /> LIVE
          </span>
        </div>
        <div className="glass rounded-2xl border border-border/50 mb-4 overflow-hidden">
          <div className={`flex items-center justify-between p-3.5 transition-all duration-400 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center">
                <span className="text-success font-bold text-xs">✓</span>
              </div>
              <div>
                <p className="text-foreground text-xs font-medium">{w.phone}</p>
                <p className="text-success text-[10px]">Withdrawal Successful</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success font-bold text-sm">${w.amount.toFixed(2)}</p>
              <p className="text-muted-foreground text-[10px]">{w.time}</p>
            </div>
          </div>
        </div>

        {/* Account Type */}
        <div className="glass rounded-2xl p-3.5 border border-border/50 flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-[10px]">Account Type</p>
            <p className="text-foreground font-semibold text-xs flex items-center gap-1">
              {accountType === 'free' ? '🆓 Free Account' : `⭐ ${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Plan`}
            </p>
          </div>
          <button onClick={() => setShowPlans(true)} className="gradient-primary text-primary-foreground px-4 py-1.5 rounded-xl text-[10px] font-semibold transition-transform active:scale-95">
            ↑ Upgrade
          </button>
        </div>

        {/* Task Grid */}
        <div className="flex items-center gap-1.5 mb-3">
          <span>📋</span>
          <h2 className="text-foreground font-bold text-sm">Start Earning</h2>
          <span className="text-muted-foreground text-[10px] ml-auto">{taskCategories.length} tasks</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {taskCategories.map((task) => (
            <TaskCard key={task.id} task={task} canAccess={canAccessSurvey(task.id)} completed={isCompleted(task.id)} onUpgrade={() => setShowPlans(true)} />
          ))}
        </div>
      </div>

      <BottomNav />
      {showPlans && <PlansModal onClose={() => setShowPlans(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} onUpgrade={() => { setShowWithdraw(false); setShowPlans(true); }} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="glass rounded-xl p-3 border border-border/50 text-center card-hover">
    <div className="flex items-center justify-center mb-1">{icon}</div>
    <p className="text-muted-foreground text-[10px]">{label}</p>
    <p className="text-foreground font-bold text-sm">{value}</p>
  </div>
);

const TaskCard = ({ task, canAccess, completed, onUpgrade }: { task: typeof taskCategories[0]; canAccess: boolean; completed: boolean; onUpgrade: () => void }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (completed) return;
    if (canAccess) {
      navigate(`/survey/${task.id}`);
    } else {
      onUpgrade();
    }
  };

  return (
    <div className="glass rounded-2xl p-3.5 border border-border/50 card-hover">
      <h3 className="text-foreground font-bold text-xs">{task.title}</h3>
      <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">{task.desc}</p>
      <p className="gradient-text-success text-[10px] font-semibold mt-2">{task.pay}</p>
      <button
        onClick={handleClick}
        disabled={completed}
        className={`w-full mt-2.5 py-2 rounded-xl text-[10px] font-semibold transition-all active:scale-[0.98] ${
          completed
            ? 'bg-success/15 text-success border border-success/20'
            : canAccess
              ? 'gradient-success text-success-foreground shadow-sm'
              : 'bg-primary/15 text-primary border border-primary/20'
        }`}
      >
        {completed ? '✓ Completed' : canAccess ? 'Start Earning →' : '🔒 Upgrade'}
      </button>
    </div>
  );
};

export default Dashboard;
