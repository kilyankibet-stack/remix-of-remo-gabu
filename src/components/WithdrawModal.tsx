import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { X, Smartphone, Building2, Bitcoin, CreditCard, ChevronDown } from 'lucide-react';

const cryptoCoins = ['Bitcoin (BTC)', 'USDT (TRC-20)', 'USDT (ERC-20)', 'Ethereum (ETH)', 'Litecoin (LTC)'];
const cryptoNetworks: Record<string, string[]> = {
  'Bitcoin (BTC)': ['Bitcoin Mainnet'],
  'USDT (TRC-20)': ['Tron (TRC-20)'],
  'USDT (ERC-20)': ['Ethereum (ERC-20)', 'Arbitrum', 'Optimism'],
  'Ethereum (ETH)': ['Ethereum Mainnet', 'Arbitrum', 'Optimism'],
  'Litecoin (LTC)': ['Litecoin Mainnet'],
};

const WithdrawModal = ({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) => {
  const { balance, accountType, setWithdrawalDetails } = useUserStore();
  const [step, setStep] = useState<'method' | 'details' | 'blocked'>('method');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [mpesaName, setMpesaName] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [cryptoCoin, setCryptoCoin] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const handleMethodSelect = (m: string) => {
    if (m === 'paypal') return;
    setMethod(m);
    setStep('details');
  };

  const getDetailsString = () => {
    if (method === 'mpesa') return `${mpesaName} - ${mpesaPhone}`;
    if (method === 'bank') return `${bankHolder} - ${bankName} - ${bankAccount}`;
    if (method === 'crypto') return `${cryptoCoin} (${cryptoNetwork}) - ${cryptoAddress}`;
    return '';
  };

  const isAmountValid = () => {
    const num = parseFloat(amount);
    return num > 0 && num <= balance;
  };

  const isFormValid = () => {
    if (!isAmountValid()) return false;
    if (method === 'mpesa') return mpesaName.trim() && mpesaPhone.trim();
    if (method === 'bank') return bankName.trim() && bankAccount.trim() && bankHolder.trim();
    if (method === 'crypto') return cryptoCoin && cryptoNetwork && cryptoAddress.trim();
    return false;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    setWithdrawalDetails({ method, details: getDetailsString() });
    if (accountType === 'free') {
      setStep('blocked');
    } else {
      alert('Withdrawal request submitted successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-5 animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">💸 Withdraw Funds</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {step === 'method' && (
          <>
            <div className="bg-success/10 rounded-xl p-3 mb-4 border border-success/20">
              <p className="text-muted-foreground text-[11px]">Available Balance</p>
              <p className="text-2xl font-black text-success">${balance.toFixed(2)}</p>
            </div>
            <p className="text-muted-foreground text-xs mb-3">Select withdrawal method:</p>
            <div className="space-y-2">
              <MethodOption icon={<Smartphone className="w-4 h-4 text-success" />} color="bg-success/15" title="M-Pesa" desc="Safaricom • Instant transfer" onClick={() => handleMethodSelect('mpesa')} />
              <MethodOption icon={<CreditCard className="w-4 h-4 text-primary" />} color="bg-primary/15" title="PayPal" desc="1-3 business days" badge="Coming Soon" onClick={() => {}} />
              <MethodOption icon={<Building2 className="w-4 h-4 text-accent-foreground" />} color="bg-accent/20" title="Bank Transfer" desc="2-5 business days" onClick={() => handleMethodSelect('bank')} />
              <MethodOption icon={<Bitcoin className="w-4 h-4 text-warning" />} color="bg-warning/15" title="Cryptocurrency" desc="Bitcoin, USDT • 1-2 hours" onClick={() => handleMethodSelect('crypto')} />
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <button onClick={() => setStep('method')} className="text-primary text-xs mb-3 flex items-center gap-1">← Back</button>

            <div className="mb-3">
              <label className="text-muted-foreground text-[11px] mb-1 block">Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground text-xs font-semibold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={balance}
                  step="0.01"
                  className="w-full bg-secondary border border-border rounded-xl pl-7 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-success/50"
                />
              </div>
              <p className="text-muted-foreground text-[10px] mt-1">Available: <span className="text-success font-semibold">${balance.toFixed(2)}</span></p>
              {amount && !isAmountValid() && (
                <p className="text-destructive text-[10px] mt-0.5">
                  {parseFloat(amount) > balance ? 'Insufficient balance' : 'Enter a valid amount'}
                </p>
              )}
            </div>

            {method === 'mpesa' && (
              <div className="space-y-3">
                <div className="bg-success/10 rounded-xl p-2.5 border border-success/20 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-success" />
                  <span className="text-foreground font-semibold text-xs">M-Pesa Withdrawal</span>
                </div>
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">Full Name</label>
                  <input value={mpesaName} onChange={(e) => setMpesaName(e.target.value)} placeholder="John Doe"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-success/50" />
                </div>
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">M-Pesa Phone Number</label>
                  <input value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder="+254 7XX XXX XXX"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-success/50" />
                </div>
              </div>
            )}

            {method === 'bank' && (
              <div className="space-y-3">
                <div className="bg-accent/20 rounded-xl p-2.5 border border-border flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent-foreground" />
                  <span className="text-foreground font-semibold text-xs">Bank Transfer</span>
                </div>
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">Account Holder Name</label>
                  <input value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} placeholder="John Doe"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">Bank Name</label>
                  <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Equity Bank"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">Account Number</label>
                  <input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="0123456789"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            )}

            {method === 'crypto' && (
              <div className="space-y-3">
                <div className="bg-warning/15 rounded-xl p-2.5 border border-warning/20 flex items-center gap-2">
                  <Bitcoin className="w-4 h-4 text-warning" />
                  <span className="text-foreground font-semibold text-xs">Crypto Withdrawal</span>
                </div>
                <div className="relative">
                  <label className="text-muted-foreground text-[11px] mb-1 block">Select Coin</label>
                  <button onClick={() => { setShowCoinDropdown(!showCoinDropdown); setShowNetworkDropdown(false); }}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-left text-xs flex items-center justify-between">
                    <span className={cryptoCoin ? 'text-foreground' : 'text-muted-foreground'}>{cryptoCoin || 'Choose cryptocurrency'}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                  {showCoinDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                      {cryptoCoins.map((c) => (
                        <button key={c} onClick={() => { setCryptoCoin(c); setCryptoNetwork(''); setShowCoinDropdown(false); }}
                          className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-primary/10 transition-colors border-b border-border last:border-0">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {cryptoCoin && (
                  <div className="relative">
                    <label className="text-muted-foreground text-[11px] mb-1 block">Select Network</label>
                    <button onClick={() => { setShowNetworkDropdown(!showNetworkDropdown); setShowCoinDropdown(false); }}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-left text-xs flex items-center justify-between">
                      <span className={cryptoNetwork ? 'text-foreground' : 'text-muted-foreground'}>{cryptoNetwork || 'Choose network'}</span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                    {showNetworkDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                        {(cryptoNetworks[cryptoCoin] || []).map((n) => (
                          <button key={n} onClick={() => { setCryptoNetwork(n); setShowNetworkDropdown(false); }}
                            className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-primary/10 transition-colors border-b border-border last:border-0">
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-muted-foreground text-[11px] mb-1 block">Wallet Address</label>
                  <input value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} placeholder="Enter wallet address"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-warning/50" />
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!isFormValid()}
              className={`w-full font-semibold py-3.5 rounded-xl mt-4 text-base transition-all ${isFormValid() ? 'gradient-success text-success-foreground' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>
              Submit Withdrawal
            </button>
          </>
        )}

        {step === 'blocked' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-foreground font-bold text-base mb-1">Paid Account Required</p>
            <p className="text-muted-foreground text-xs mb-4">Upgrade your account to process withdrawals and unlock all features.</p>
            <button onClick={() => { onClose(); onUpgrade(); }}
              className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base glow-primary">
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MethodOption = ({ icon, color, title, desc, badge, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary text-left transition-all hover:border-primary/50 ${badge ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
    <div className="flex-1">
      <p className="text-foreground font-semibold text-xs">{title}</p>
      <p className="text-muted-foreground text-[11px]">{desc}</p>
    </div>
    {badge && <span className="bg-warning/20 text-warning text-[9px] px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
  </button>
);

export default WithdrawModal;
