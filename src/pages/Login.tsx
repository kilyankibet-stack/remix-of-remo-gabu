import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/integrations/supabase/client';
import { User, Loader2 } from 'lucide-react';

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

      // Query profile by email and password
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

      // Load completed surveys
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
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 mt-8">
          <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
            <User className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mt-2">Welcome Back</h1>
          <p className="text-accent-foreground text-xs">Sign in to continue earning</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 mt-1 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 mt-1 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-destructive text-xs bg-destructive/10 rounded-lg p-2">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base glow-primary flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In'}
          </button>
          <p className="text-center text-muted-foreground text-xs">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-accent-foreground font-semibold">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
