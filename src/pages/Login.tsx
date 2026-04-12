import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/integrations/supabase/client';
import { User, Loader2, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const loadFromDB = useUserStore((s) => s.loadFromDB);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const emailLower = email.trim().toLowerCase();

      const { data: profile, error: qError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailLower)
        .eq('password_hash', password)
        .maybeSingle();

      if (qError) throw qError;

      if (!profile) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      const { data: surveys } = await supabase
        .from('completed_surveys')
        .select('survey_id')
        .eq('user_email', emailLower);

      const surveyIds = (surveys || []).map((s) => s.survey_id);
      loadFromDB(profile, surveyIds);

      if (profile.assessment_done) {
        navigate('/dashboard');
      } else {
        navigate('/assessment');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex flex-col items-center mb-8 mt-8">
          <div className="w-18 h-18 rounded-2xl gradient-primary p-4 flex items-center justify-center glow-primary">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to continue earning</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-xl pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-xl pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
            </div>
          </div>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              <p className="text-destructive text-xs">{error}</p>
            </div>
          )}
          <button onClick={handleLogin} disabled={loading}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base glow-primary flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In'}
          </button>
          <p className="text-center text-muted-foreground text-sm pt-2">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-accent-foreground font-semibold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
