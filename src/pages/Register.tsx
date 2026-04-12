import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/integrations/supabase/client';
import { User, Loader2, Mail, Lock, Phone, Globe } from 'lucide-react';

const InputField = ({ label, icon: Icon, field, placeholder, type = 'text', value, onChange, error }: {
  label: string; icon: any; field: string; placeholder: string; type?: string;
  value: string; onChange: (field: string, value: string) => void; error?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-foreground mb-1.5 block">{label} *</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-input border border-border rounded-xl pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
      />
    </div>
    {error && <p className="text-destructive text-[11px] mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', country: 'Kenya', password: '', confirmPassword: '', referral: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 4) e.password = 'Min 4 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', form.email.trim().toLowerCase())
        .maybeSingle();

      if (existing) {
        setErrors({ email: 'An account with this email already exists' });
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('profiles').insert({
        email: form.email.trim().toLowerCase(),
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        country: form.country,
        password_hash: form.password,
      });

      if (insertError) throw insertError;

      login({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        country: form.country,
      });
      navigate('/assessment');
    } catch (err: any) {
      setErrors({ email: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-18 h-18 rounded-2xl gradient-primary p-4 flex items-center justify-center glow-primary">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join us and start earning today</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-border/50 space-y-3.5">
          <InputField label="Full Name" icon={User} field="fullName" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} error={errors.fullName} />
          <InputField label="Phone Number" icon={Phone} field="phone" placeholder="+254 700 000 000" value={form.phone} onChange={handleChange} error={errors.phone} />
          <InputField label="Email Address" icon={Mail} field="email" placeholder="your.email@example.com" value={form.email} onChange={handleChange} error={errors.email} />
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Country *</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full bg-input border border-border rounded-xl pl-10 pr-3 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option>Kenya</option><option>Uganda</option><option>Tanzania</option>
                <option>Nigeria</option><option>Ghana</option><option>South Africa</option>
              </select>
            </div>
          </div>
          <InputField label="Password" icon={Lock} field="password" placeholder="Create a secure password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          <InputField label="Confirm Password" icon={Lock} field="confirmPassword" placeholder="Re-enter your password" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <div>
            <label className="text-xs font-semibold text-success">Referral Code (Optional)</label>
            <input
              placeholder="Enter referral code if you have one"
              value={form.referral}
              onChange={(e) => handleChange('referral', e.target.value)}
              className="w-full bg-success/10 border border-success/20 rounded-xl px-3 py-3 mt-1.5 text-success placeholder:text-success/50 text-sm focus:outline-none focus:ring-2 focus:ring-success transition-all"
            />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base glow-primary flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Account'}
          </button>
          <p className="text-center text-muted-foreground text-sm pt-1">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-accent-foreground font-semibold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
