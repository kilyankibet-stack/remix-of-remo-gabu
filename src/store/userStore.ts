import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface UserState {
  isLoggedIn: boolean;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  accountType: 'free' | 'beginner' | 'average' | 'expert' | 'elite';
  balance: number;
  assessmentDone: boolean;
  bonusClaimed: boolean;
  completedSurveys: string[];
  withdrawalDetails: {
    method: string;
    details: string;
  } | null;
  showWithdrawModal: boolean;
  login: (data: { fullName: string; email: string; phone: string; country: string }) => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  setAssessmentDone: () => void;
  claimBonus: () => void;
  completeSurvey: (id: string, reward: number) => void;
  setAccountType: (type: UserState['accountType']) => void;
  setWithdrawalDetails: (details: { method: string; details: string }) => void;
  setShowWithdrawModal: (show: boolean) => void;
  loadFromDB: (profile: any, surveys: string[]) => void;
}

const syncProfileToDB = async (email: string, updates: {
  balance?: number;
  assessment_done?: boolean;
  bonus_claimed?: boolean;
  account_type?: string;
}) => {
  try {
    await supabase.from('profiles').update(updates).eq('email', email);
  } catch (e) {
    console.error('DB sync error:', e);
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      fullName: '',
      email: '',
      phone: '',
      country: 'Kenya',
      accountType: 'free',
      balance: 0,
      assessmentDone: false,
      bonusClaimed: false,
      completedSurveys: [],
      withdrawalDetails: null,
      showWithdrawModal: false,
      login: (data) => set({ isLoggedIn: true, ...data }),
      logout: () => set({
        isLoggedIn: false, fullName: '', email: '', phone: '', country: 'Kenya',
        accountType: 'free', balance: 0, assessmentDone: false, bonusClaimed: false,
        completedSurveys: [], withdrawalDetails: null, showWithdrawModal: false,
      }),
      addBalance: (amount) => {
        const s = get();
        const newBalance = s.balance + amount;
        set({ balance: newBalance });
        if (s.email) syncProfileToDB(s.email, { balance: newBalance });
      },
      setAssessmentDone: () => {
        set({ assessmentDone: true });
        const s = get();
        if (s.email) syncProfileToDB(s.email, { assessment_done: true });
      },
      claimBonus: () => {
        const s = get();
        const newBalance = s.balance + 10;
        set({ bonusClaimed: true, balance: newBalance });
        if (s.email) syncProfileToDB(s.email, { bonus_claimed: true, balance: newBalance });
      },
      completeSurvey: async (id, reward) => {
        const s = get();
        const newBalance = s.balance + reward;
        const newSurveys = [...s.completedSurveys, id];
        set({ completedSurveys: newSurveys, balance: newBalance });
        if (s.email) {
          syncProfileToDB(s.email, { balance: newBalance });
          try {
            await supabase.from('completed_surveys').insert({
              user_email: s.email,
              survey_id: id,
              reward: reward,
            });
          } catch (e) {
            console.error('Survey insert error:', e);
          }
        }
      },
      setAccountType: (type) => {
        set({ accountType: type });
        const s = get();
        if (s.email) syncProfileToDB(s.email, { account_type: type });
      },
      setWithdrawalDetails: (details) => set({ withdrawalDetails: details }),
      setShowWithdrawModal: (show) => set({ showWithdrawModal: show }),
      loadFromDB: (profile, surveys) => set({
        isLoggedIn: true,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone || '',
        country: profile.country || 'Kenya',
        accountType: (profile.account_type || 'free') as UserState['accountType'],
        balance: Number(profile.balance) || 0,
        assessmentDone: profile.assessment_done || false,
        bonusClaimed: profile.bonus_claimed || false,
        completedSurveys: surveys,
      }),
    }),
    { name: 'remotask-user' }
  )
);
