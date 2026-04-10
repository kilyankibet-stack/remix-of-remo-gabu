import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import BottomNav from '@/components/BottomNav';
import PlansModal from '@/components/PlansModal';
import WithdrawModal from '@/components/WithdrawModal';
import ProfileModal from '@/components/ProfileModal';
import { Bell, Menu, CheckSquare } from 'lucide-react';

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
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">R</span>
            </div>
            <span className="text-foreground font-bold text-sm">REMOTASK</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <button onClick={() => setShowProfile(true)} className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-[10px]">{firstName[0]}{fullName.split(' ')[1]?.[0] || ''}</span>
            </button>
            <Menu className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-muted-foreground text-xs">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{firstName}</h1>
          </div>
          <CheckSquare className="w-5 h-5 text-success" />
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-[11px] flex items-center gap-1">💰 Available Balance</p>
              <p className="text-2xl font-black text-foreground mt-0.5">${balance.toFixed(2)}</p>
            </div>
            <button onClick={() => setShowWithdraw(true)} className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1">
              💸 Withdraw
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-card rounded-xl p-2.5 border border-border text-center">
            <p className="text-muted-foreground text-[10px]">Tasks</p>
            <p className="text-foreground font-bold text-sm">400+</p>
          </div>
          <div className="bg-card rounded-xl p-2.5 border border-border text-center">
            <p className="text-muted-foreground text-[10px]">Available</p>
            <p className="text-foreground font-bold text-sm">24 hrs</p>
          </div>
          <div className="bg-card rounded-xl p-2.5 border border-border text-center">
            <p className="text-muted-foreground text-[10px]">Active Users</p>
            <p className="text-foreground font-bold text-sm">1,205</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span>🌍</span>
            <span className="text-foreground font-semibold text-xs">Live Withdrawals</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" /> LIVE
          </span>
        </div>
        <div className="bg-card rounded-xl border border-border mb-3 overflow-hidden">
          <div className={`flex items-center justify-between p-3 transition-all duration-400 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-success font-bold text-[10px]">M</span>
              </div>
              <div>
                <p className="text-foreground text-xs font-medium">{w.phone}</p>
                <p className="text-success text-[10px]">✓ Withdrawal Successful</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success font-bold text-xs">${w.amount.toFixed(2)}</p>
              <p className="text-muted-foreground text-[10px]">● {w.time}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-3 border border-border flex items-center justify-between mb-3">
          <div>
            <p className="text-muted-foreground text-[10px]">Account Type</p>
            <p className="text-foreground font-semibold text-xs flex items-center gap-1">
              🆓 {accountType === 'free' ? 'Free Account' : `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Plan`}
            </p>
          </div>
          <button onClick={() => setShowPlans(true)} className="bg-primary/20 text-accent-foreground px-3 py-1.5 rounded-lg text-[10px] font-semibold">
            ↑ Upgrade
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <span>📋</span>
          <h2 className="text-foreground font-bold text-sm">Start Earning</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
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

const TaskCard = ({ task, canAccess, onUpgrade }: { task: typeof taskCategories[0]; canAccess: boolean; onUpgrade: () => void }) => {
  const handleClick = () => {
    if (canAccess) {
      window.location.href = `/survey/${task.id}`;
    } else {
      onUpgrade();
    }
  };

  return (
    <div className="bg-card rounded-xl p-3 border border-border">
      <h3 className="text-foreground font-bold text-xs">{task.title}</h3>
      <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">{task.desc}</p>
      <p className="text-success text-[10px] font-semibold mt-1.5">{task.pay}</p>
      <button
        onClick={handleClick}
        className={`w-full mt-2 py-1.5 rounded-lg text-[10px] font-semibold ${
          canAccess
            ? 'gradient-success text-success-foreground'
            : 'bg-secondary text-muted-foreground'
        }`}
      >
        {canAccess ? 'Start Earning →' : '🔒 Upgrade'}
      </button>
    </div>
  );
};

export default Dashboard;
