
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'Kenya',
  account_type TEXT DEFAULT 'free',
  balance NUMERIC DEFAULT 0,
  assessment_done BOOLEAN DEFAULT false,
  bonus_claimed BOOLEAN DEFAULT false,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read profiles by email" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'pending',
  checkout_ref TEXT,
  receipt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Anyone can update payments" ON public.payments FOR UPDATE USING (true);

CREATE TABLE public.completed_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  survey_id TEXT NOT NULL,
  reward NUMERIC NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_email, survey_id)
);

ALTER TABLE public.completed_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert completed surveys" ON public.completed_surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read completed surveys" ON public.completed_surveys FOR SELECT USING (true);
