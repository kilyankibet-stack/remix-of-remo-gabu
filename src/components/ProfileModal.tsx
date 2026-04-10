import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Phone, Globe, Shield, LogOut } from 'lucide-react';

const ProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { fullName, email, phone, country, accountType, balance, completedSurveys, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 animate-scale-in shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">👤 My Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-3">
            <span className="text-primary-foreground font-bold text-2xl">
              {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <h3 className="text-foreground font-bold text-lg">{fullName}</h3>
          <span className="text-xs bg-primary/20 text-accent-foreground px-3 py-1 rounded-full mt-1 font-semibold">
            {accountType === 'free' ? 'Free Account' : `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Plan`}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <ProfileRow icon={<Mail className="w-4 h-4" />} label="Email" value={email} />
          <ProfileRow icon={<Phone className="w-4 h-4" />} label="Phone" value={phone} />
          <ProfileRow icon={<Globe className="w-4 h-4" />} label="Country" value={country} />
          <ProfileRow icon={<Shield className="w-4 h-4" />} label="Surveys Done" value={`${completedSurveys.length}`} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-success/10 rounded-xl p-3 text-center border border-success/20">
            <p className="text-muted-foreground text-xs">Balance</p>
            <p className="text-success font-bold text-lg">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20">
            <p className="text-muted-foreground text-xs">Tasks Done</p>
            <p className="text-accent-foreground font-bold text-lg">{completedSurveys.length}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-destructive/15 text-destructive font-semibold py-3 rounded-xl text-sm hover:bg-destructive/25 transition-colors">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

const ProfileRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
    <span className="text-muted-foreground">{icon}</span>
    <div className="flex-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-foreground text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default ProfileModal;
