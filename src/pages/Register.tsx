import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/integrations/supabase/client';
import { User, Loader2 } from 'lucide-react';

const FormField = ({ label, field, placeholder, type = 'text', value, onChange, error }: {
  label: string; field: string; placeholder: string; type?: string;
  value: string; onChange: (field: string, value: string) => void; error?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-foreground">{label} *</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 mt-1 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
    />
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
      // Check if email already exists
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

      // Insert new profile
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
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
            <User className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mt-2">Create Account</h1>
          <p className="text-accent-foreground text-xs">Join us and start earning today</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border space-y-3">
          <FormField label="Full Name" field="fullName" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} error={errors.fullName} />
          <FormField label="Phone Number" field="phone" placeholder="+254 700 000 000" value={form.phone} onChange={handleChange} error={errors.phone} />
          <FormField label="Email Address" field="email" placeholder="your.email@example.com" value={form.email} onChange={handleChange} error={errors.email} />
          <div>
            <label className="text-xs font-semibold text-foreground">Country *</label>
            <select
              value={form.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 mt-1 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Kenya</option><option>Uganda</option><option>Tanzania</option>
              <option>Nigeria</option><option>Ghana</option><option>South Africa</option>
            </select>
          </div>
          <FormField label="Password" field="password" placeholder="Create a secure password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          <FormField label="Confirm Password" field="confirmPassword" placeholder="Re-enter your password" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <div>
            <label className="text-xs font-semibold text-accent-foreground">Referral Code (Optional)</label>
            <input
              placeholder="Enter referral code if you have one"
              value={form.referral}
              onChange={(e) => handleChange('referral', e.target.value)}
              className="w-full bg-success/10 border border-success/30 rounded-lg px-3 py-2.5 mt-1 text-success placeholder:text-success/60 text-xs focus:outline-none focus:ring-2 focus:ring-success"
            />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base glow-primary flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Account'}
          </button>
          <p className="text-center text-muted-foreground text-[11px]">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-accent-foreground font-semibold">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
