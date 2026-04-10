

# Implementation Plan: Database Auth, Survey Gating, Withdrawals & 30 Surveys

## Overview
This plan covers 7 major areas: database-backed authentication, free survey gating (only 1 free survey total), withdrawal blocking for free accounts, bottom nav withdraw button fix, expanding to 30 surveys, font improvements, and faster STK push polling.

---

## 1. Database-Backed Registration & Login

**Register.tsx** — On submit, insert a new row into `profiles` table (email, full_name, phone, country, password stored as plain text hash). Check if email already exists first, show error if duplicate.

**Login.tsx** — Query `profiles` table by email + password. If found, load ALL user data (balance, account_type, assessment_done, bonus_claimed, completed_surveys from `completed_surveys` table) into the Zustand store. If not found, show "Invalid credentials."

**userStore.ts** — Add a `loadFromDB` action that hydrates the store from a database profile object. Update `completeSurvey`, `claimBonus`, `setAssessmentDone`, `addBalance`, `setAccountType` to also write to the database (profiles table and completed_surveys table) alongside local state.

---

## 2. Free Survey Gating (Only 1 Free Survey)

Currently `data-cat` is marked `free: true` in Dashboard. The logic change:
- In **Survey.tsx**: Before starting any survey, check `completedSurveys.length`. If user has completed 1+ surveys AND `accountType === 'free'`, show a "Paid Account Required" screen with an Upgrade button instead of the survey questions.
- In **Dashboard.tsx TaskCard**: Change logic so the first survey card (any survey) is accessible if `completedSurveys.length === 0`, but after completing one survey, ALL remaining surveys require a paid account. Keep `data-cat` as the designated free one.

---

## 3. Withdrawal — Free Account Blocking + Bottom Nav Fix

**WithdrawModal.tsx** — Already correctly blocks free accounts after entering details. The "Upgrade Now" button in the blocked step should open PlansModal. Pass an `onUpgrade` callback prop.

**BottomNav.tsx** — The Withdraw button currently just navigates to `/dashboard`. Fix it to trigger the WithdrawModal directly. Options:
- Use Zustand to store a `showWithdrawModal` flag, or
- Navigate to `/dashboard` with a query param `?withdraw=true` and have Dashboard read it to auto-open WithdrawModal.

The simpler approach: add a global state flag `showWithdrawModal` in userStore, set it in BottomNav, read it in Dashboard.

---

## 4. Expand to 30 Surveys

Add 18 more survey categories to `surveyQuestions` in Survey.tsx and `taskCategories` in Dashboard.tsx. New categories (examples):
- Text Summarization, Email Classification, Product Categorization, Grammar Correction, Spam Detection, Ad Relevance, Search Quality, Video Tagging, Resume Screening, Legal Review, Map Validation, Weather Data, Social Media Analysis, Customer Support QA, Accessibility Audit, UI/UX Review, Math Verification, Science Fact Check

Each with 10 high-quality questions.

---

## 5. Font Size Improvements

Update `src/index.css` base font to `13px` and ensure the app looks clean and professional with slightly smaller, tighter typography throughout.

---

## 6. Faster STK Push Polling

In **PlansModal.tsx**, reduce polling interval from 3s to 2s and increase max attempts. Show countdown or live status messages during polling for better UX feedback.

---

## 7. Earnings Page Update

Update `getSurveyReward` in **Earnings.tsx** to include rewards for all 30 survey categories, and pull completed surveys from the database.

---

## Technical Details

### Database writes (no schema changes needed — tables already exist):
- `profiles` table: INSERT on register, SELECT on login, UPDATE on balance/account changes
- `completed_surveys` table: INSERT when survey completed, SELECT on login to load history
- `payments` table: already working for STK push

### Files to create/modify:
| File | Action |
|---|---|
| `src/pages/Register.tsx` | Add Supabase insert on signup |
| `src/pages/Login.tsx` | Add Supabase query on login, load full profile |
| `src/store/userStore.ts` | Add DB sync actions, `showWithdrawModal` flag |
| `src/pages/Survey.tsx` | Add free account gating + 18 new survey sets |
| `src/pages/Dashboard.tsx` | Add 18 new task cards, free survey logic |
| `src/components/WithdrawModal.tsx` | Connect Upgrade button to PlansModal |
| `src/components/BottomNav.tsx` | Trigger WithdrawModal via store flag |
| `src/pages/Earnings.tsx` | Update rewards map for all 30 surveys |
| `src/components/PlansModal.tsx` | Faster polling (2s) |
| `src/index.css` | Font size refinement |

### Security note:
- Password stored as plain text in profiles table (no auth.users since we're not using Supabase Auth). This is intentional for the app's simplicity — it's a task/survey platform, not a banking app.
- RLS policies already allow public read/write which matches the current no-auth architecture.

