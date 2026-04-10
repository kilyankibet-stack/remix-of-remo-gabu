import { Home, LayoutGrid, DollarSign, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const setShowWithdrawModal = useUserStore((s) => s.setShowWithdrawModal);

  const items = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: LayoutGrid, label: 'Earnings', path: '/earnings' },
    { icon: DollarSign, label: 'Withdraw', path: '/dashboard', special: true },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {items.map((item) => {
          const active = path === item.path && !item.special;
          if (item.special) {
            return (
              <button key={item.label} onClick={() => {
                if (path !== '/dashboard') navigate('/dashboard');
                setTimeout(() => setShowWithdrawModal(true), 100);
              }} className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 rounded-full gradient-success flex items-center justify-center shadow-lg glow-success">
                  <item.icon className="w-6 h-6 text-success-foreground" />
                </div>
                <span className="text-success text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          }
          return (
            <button key={item.label} onClick={() => navigate(item.path)} className="flex flex-col items-center py-1">
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] mt-1 ${active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
