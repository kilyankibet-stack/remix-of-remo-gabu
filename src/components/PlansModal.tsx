import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/integrations/supabase/client';
import { X, Lock, Star, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';

const plans = [
  { id: 'beginner', name: 'Beginner', tasks: 9, pay: '$1.50 – 2.00/task', daily: '$13.50', monthly: '$400', price: 3 },
  { id: 'average', name: 'Average Skilled', tasks: 15, pay: '$1.70 – 2.80/task', daily: '$22.00', monthly: '$650', price: 5, popular: true },
  { id: 'expert', name: 'Expert', tasks: 25, pay: '$1.85 – 4.00/task', daily: '$30.00', monthly: '$900', price: 8 },
  { id: 'elite', name: 'Elite', tasks: 40, pay: '$2.50 – 5.00/task', daily: '$40.00', monthly: '$1,200', price: 13 },
];

const USD_TO_KES = 130;

const PlansModal = ({ onClose }: { onClose: () => void }) => {
  const { setAccountType, fullName, email } = useUserStore();
  const [step, setStep] = useState<'plans' | 'pay' | 'processing' | 'success' | 'failed'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setStep('pay');
    setError('');
  };

  const handlePay = async () => {
    if (!phone.trim() || !selectedPlan) return;
    setError('');
    setStep('processing');

    try {
      const amountKES = selectedPlan.price * USD_TO_KES;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lipwa-pay`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phone,
            amount: amountKES,
            plan: selectedPlan.id,
            user_email: email,
            user_name: fullName,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Payment request failed. Please check your phone number and try again.');
      }
      if (!data?.checkout_request_id) {
        throw new Error('No checkout reference received. Please try again.');
      }

      // Save payment record to database
      await supabase.from('payments').insert({
        user_email: email,
        plan: selectedPlan.id,
        amount: amountKES,
        currency: 'KES',
        status: 'pending',
        checkout_ref: data.checkout_request_id,
      });

      // Fast polling every 2 seconds
      let attempts = 0;
      const maxAttempts = 60;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lipwa-status?ref=${data.checkout_request_id}`,
            {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                'Content-Type': 'application/json',
              },
            }
          );
          const statusJson = await statusRes.json();

          if (statusJson.status === 'payment.success') {
            clearInterval(pollInterval);
            setAccountType(selectedPlan.id as any);
            // Update profile in DB
            await supabase.from('profiles').update({ account_type: selectedPlan.id }).eq('email', email);
            setStep('success');
          } else if (statusJson.status === 'payment.failed' || statusJson.status === 'payment.cancelled') {
            clearInterval(pollInterval);
            setStep('failed');
            setError('Payment was cancelled or failed. Please try again.');
          }
        } catch (e) {
          // Keep polling
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setStep('failed');
          setError('Payment confirmation timed out. If you paid, please contact support.');
        }
      }, 2000);
    } catch (e: any) {
      console.error('Payment error:', e);
      setError(e.message || 'Something went wrong. Please try again.');
      setStep('pay');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-5 animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {step === 'plans' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-bold text-foreground">Account Package Required</h2>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-muted-foreground text-xs mb-3">Choose a plan to unlock all tasks and withdrawals:</p>

            <div className="space-y-2.5">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full text-left rounded-xl p-3.5 border transition-all ${
                    plan.popular ? 'border-warning bg-warning/5' : 'border-border bg-secondary'
                  }`}
                >
                  {plan.popular && (
                    <span className="inline-flex items-center gap-1 bg-warning/20 text-warning px-2 py-0.5 rounded-full text-[9px] font-bold float-right">
                      <Star className="w-2.5 h-2.5" /> POPULAR
                    </span>
                  )}
                  <h3 className="text-foreground font-bold text-sm">{plan.name}</h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {plan.tasks} tasks/day • {plan.pay}
                  </p>
                  <p className="text-success text-[11px]">
                    Daily: {plan.daily} • Monthly: {plan.monthly}
                  </p>
                  <p className="text-accent-foreground font-bold text-base float-right -mt-5">
                    ${plan.price}.00 <span className="text-[10px] font-normal text-muted-foreground">/month</span>
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'pay' && selectedPlan && (
          <>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setStep('plans')} className="text-primary text-xs">← Back</button>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Pay with M-Pesa</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{selectedPlan.name} Plan</p>
            </div>

            <div className="bg-success/10 rounded-xl p-3 mb-4 border border-success/20 text-center">
              <p className="text-muted-foreground text-[10px]">Amount to pay</p>
              <p className="text-xl font-black text-success">KES {(selectedPlan.price * USD_TO_KES).toLocaleString()}</p>
              <p className="text-muted-foreground text-[10px]">(${selectedPlan.price}.00 USD)</p>
            </div>

            <div className="mb-3">
              <label className="text-muted-foreground text-[11px] mb-1 block">M-Pesa Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678 or 254712345678"
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
              />
            </div>

            {error && (
              <p className="text-destructive text-xs mb-2 bg-destructive/10 rounded-lg p-2">{error}</p>
            )}

            <button
              onClick={handlePay}
              disabled={!phone.trim()}
              className={`w-full font-semibold py-3 rounded-xl text-base transition-all ${
                phone.trim() ? 'gradient-success text-success-foreground' : 'bg-secondary text-muted-foreground cursor-not-allowed'
              }`}
            >
              Pay KES {(selectedPlan.price * USD_TO_KES).toLocaleString()} →
            </button>

            <p className="text-muted-foreground text-[9px] text-center mt-2">
              An M-Pesa STK push will be sent to your phone. Enter your PIN to complete payment.
            </p>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-6">
            <Loader2 className="w-14 h-14 text-success mx-auto mb-3 animate-spin" />
            <h2 className="text-lg font-bold text-foreground mb-1">Processing Payment</h2>
            <p className="text-muted-foreground text-xs">Check your phone for the M-Pesa prompt and enter your PIN.</p>
            <p className="text-muted-foreground text-[10px] mt-3">Waiting for confirmation...</p>
          </div>
        )}

        {step === 'success' && selectedPlan && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">Payment Successful! 🎉</h2>
            <p className="text-muted-foreground text-xs mb-1">Your {selectedPlan.name} plan is now active.</p>
            <p className="text-success font-semibold text-xs">All tasks and withdrawals are unlocked!</p>
            <button
              onClick={onClose}
              className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl mt-4 text-base"
            >
              Start Earning →
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-3">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">Payment Failed</h2>
            <p className="text-muted-foreground text-xs mb-3">{error || 'The payment was not completed.'}</p>
            <button
              onClick={() => { setStep('pay'); setError(''); }}
              className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl text-base"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansModal;
