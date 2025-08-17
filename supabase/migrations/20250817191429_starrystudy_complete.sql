-- Location: supabase/migrations/20250817191429_starrystudy_complete.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete authentication + study management system
-- Dependencies: none - fresh start

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('student', 'educator', 'admin');
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE public.goal_status AS ENUM ('active', 'completed', 'paused', 'cancelled');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.study_session_type AS ENUM ('focus', 'break', 'review', 'practice');

-- 2. Core User Table (Critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'student'::public.user_role,
    total_points INTEGER DEFAULT 0,
    study_streak INTEGER DEFAULT 0,
    joined_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Friends/Social System
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    addressee_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, addressee_id)
);

-- 4. Daily Tasks System
CREATE TABLE public.daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status public.task_status DEFAULT 'pending'::public.task_status,
    priority public.priority_level DEFAULT 'medium'::public.priority_level,
    estimated_duration INTEGER, -- minutes
    actual_duration INTEGER DEFAULT 0, -- minutes
    points_value INTEGER DEFAULT 10,
    due_date DATE DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Monthly Goals System
CREATE TABLE public.monthly_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status public.goal_status DEFAULT 'active'::public.goal_status,
    target_value INTEGER DEFAULT 1,
    current_progress INTEGER DEFAULT 0,
    points_value INTEGER DEFAULT 100,
    target_month DATE NOT NULL, -- First day of the target month
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Study Sessions/Timer System
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.daily_tasks(id) ON DELETE SET NULL,
    session_type public.study_session_type DEFAULT 'focus'::public.study_session_type,
    duration_minutes INTEGER NOT NULL,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    notes TEXT,
    points_earned INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Points/Achievements System
CREATE TABLE public.user_points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('task_completion', 'goal_achievement', 'study_session', 'daily_streak', 'bonus')),
    source_id UUID, -- Reference to the task, goal, or session that earned the points
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes for Performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);
CREATE INDEX idx_daily_tasks_user_date ON public.daily_tasks(user_id, due_date);
CREATE INDEX idx_daily_tasks_status ON public.daily_tasks(status);
CREATE INDEX idx_monthly_goals_user_month ON public.monthly_goals(user_id, target_month);
CREATE INDEX idx_study_sessions_user_started ON public.study_sessions(user_id, started_at);
CREATE INDEX idx_study_sessions_task ON public.study_sessions(task_id);
CREATE INDEX idx_points_history_user_created ON public.user_points_history(user_id, created_at);

-- 9. Helper Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update user's total points when points history is added
    UPDATE public.user_profiles
    SET 
        total_points = total_points + NEW.points_earned,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_points_for_task_completion()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Award points when task is completed
    IF NEW.status = 'completed'::public.task_status AND OLD.status != 'completed'::public.task_status THEN
        INSERT INTO public.user_points_history (user_id, points_earned, source_type, source_id, description)
        VALUES (
            NEW.user_id,
            NEW.points_value,
            'task_completion',
            NEW.id,
            'Completed task: ' || NEW.title
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- 10. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points_history ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies (Using Pattern 1 for user_profiles, Pattern 2 for others)

-- Pattern 1: Core user table (user_profiles) - Simple, direct column reference
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for all other tables
CREATE POLICY "users_manage_own_friendships"
ON public.friendships
FOR ALL
TO authenticated
USING (requester_id = auth.uid() OR addressee_id = auth.uid())
WITH CHECK (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "users_manage_own_daily_tasks"
ON public.daily_tasks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_monthly_goals"
ON public.monthly_goals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_study_sessions"
ON public.study_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_points_history"
ON public.user_points_history
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read for leaderboards, private write for user data
CREATE POLICY "public_can_read_user_leaderboard_data"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_points_history_added
  AFTER INSERT ON public.user_points_history
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

CREATE TRIGGER on_task_completion
  AFTER UPDATE ON public.daily_tasks
  FOR EACH ROW EXECUTE FUNCTION public.award_points_for_task_completion();

-- 13. Mock Data for Testing
DO $$
DECLARE
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
    user3_id UUID := gen_random_uuid();
    task1_id UUID := gen_random_uuid();
    task2_id UUID := gen_random_uuid();
    goal1_id UUID := gen_random_uuid();
    session1_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alex.johnson@gmail.com', crypt('StarryStudy2025', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Johnson", "avatar_url": "https://randomuser.me/api/portraits/men/32.jpg"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.chen@gmail.com', crypt('StarryStudy2025', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Chen", "avatar_url": "https://randomuser.me/api/portraits/women/44.jpg"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mike.williams@gmail.com', crypt('StarryStudy2025', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Williams", "avatar_url": "https://randomuser.me/api/portraits/men/24.jpg"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- User profiles will be created automatically via trigger

    -- Create friendships
    INSERT INTO public.friendships (requester_id, addressee_id, status, created_at) VALUES
        (user1_id, user2_id, 'accepted', CURRENT_TIMESTAMP - INTERVAL '5 days'),
        (user1_id, user3_id, 'accepted', CURRENT_TIMESTAMP - INTERVAL '3 days'),
        (user2_id, user3_id, 'pending', CURRENT_TIMESTAMP - INTERVAL '1 day');

    -- Create daily tasks
    INSERT INTO public.daily_tasks (id, user_id, title, description, status, priority, estimated_duration, points_value, due_date) VALUES
        (task1_id, user1_id, 'Complete Math Assignment', 'Finish chapter 5 exercises on calculus derivatives', 'in_progress'::public.task_status, 'high'::public.priority_level, 120, 25, CURRENT_DATE),
        (task2_id, user1_id, 'Review Physics Notes', 'Go through quantum mechanics lecture notes', 'pending'::public.task_status, 'medium'::public.priority_level, 60, 15, CURRENT_DATE),
        (gen_random_uuid(), user2_id, 'Study Spanish Vocabulary', 'Learn 30 new Spanish words using flashcards', 'completed'::public.task_status, 'medium'::public.priority_level, 45, 20, CURRENT_DATE),
        (gen_random_uuid(), user3_id, 'Read History Chapter', 'Chapter 12: World War II consequences', 'pending'::public.task_status, 'low'::public.priority_level, 90, 20, CURRENT_DATE);

    -- Create monthly goals
    INSERT INTO public.monthly_goals (id, user_id, title, description, target_value, current_progress, points_value, target_month) VALUES
        (goal1_id, user1_id, 'Complete 50 Study Sessions', 'Focus on maintaining consistent daily study habits', 50, 23, 150, DATE_TRUNC('month', CURRENT_DATE)),
        (gen_random_uuid(), user2_id, 'Read 4 Academic Books', 'Expand knowledge in computer science field', 4, 2, 200, DATE_TRUNC('month', CURRENT_DATE)),
        (gen_random_uuid(), user3_id, 'Achieve 1000 Study Points', 'Earn points through various study activities', 1000, 450, 300, DATE_TRUNC('month', CURRENT_DATE));

    -- Create study sessions
    INSERT INTO public.study_sessions (id, user_id, task_id, session_type, duration_minutes, started_at, ended_at, notes, points_earned, is_completed) VALUES
        (session1_id, user1_id, task1_id, 'focus'::public.study_session_type, 45, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 15 minutes', 'Good progress on derivative rules', 15, true),
        (gen_random_uuid(), user1_id, task2_id, 'review'::public.study_session_type, 30, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'Reviewed wave-particle duality', 10, true),
        (gen_random_uuid(), user2_id, null, 'focus'::public.study_session_type, 60, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Vocabulary practice session', 20, true);

    -- Points history will be created automatically via triggers for task completions
    -- Add some manual bonus points
    INSERT INTO public.user_points_history (user_id, points_earned, source_type, description) VALUES
        (user1_id, 50, 'daily_streak', 'Maintained 7-day study streak'),
        (user2_id, 25, 'bonus', 'Helped a friend with difficult concept'),
        (user3_id, 30, 'daily_streak', 'Maintained 5-day study streak');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;