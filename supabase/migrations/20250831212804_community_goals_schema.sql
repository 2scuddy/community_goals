-- Community Goals Platform Complete Schema
-- Database schema for users, goals, groups, check-ins, and gamification
-- Schema Analysis: No existing schema found - creating complete schema from scratch

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'member');
CREATE TYPE public.goal_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE public.goal_category AS ENUM ('fitness', 'health', 'career', 'education', 'personal_development', 'creative', 'financial', 'relationships', 'lifestyle', 'other');
CREATE TYPE public.goal_visibility AS ENUM ('public', 'friends', 'private');
CREATE TYPE public.group_status AS ENUM ('active', 'paused', 'completed', 'archived');
CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'inactive', 'banned');
CREATE TYPE public.membership_role AS ENUM ('owner', 'moderator', 'member');
CREATE TYPE public.check_in_type AS ENUM ('progress', 'milestone', 'reflection', 'challenge');
CREATE TYPE public.badge_type AS ENUM ('streak', 'milestone', 'community', 'achievement', 'special');
CREATE TYPE public.notification_type AS ENUM ('system', 'group', 'friend', 'reminder', 'achievement');

-- 2. Core User Management
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    role public.user_role DEFAULT 'member'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "friends"}',
    preferences JSONB DEFAULT '{"notifications": true, "email_digest": "weekly", "theme": "light"}',
    points BIGINT DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_check_in_date DATE,
    goals_completed INTEGER DEFAULT 0,
    groups_joined INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Goal Management
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category public.goal_category NOT NULL,
    status public.goal_status DEFAULT 'draft'::public.goal_status,
    visibility public.goal_visibility DEFAULT 'public'::public.goal_visibility,
    target_value DECIMAL,
    target_unit TEXT,
    current_progress DECIMAL DEFAULT 0,
    start_date DATE,
    target_date DATE,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern JSONB, -- {frequency: 'daily', interval: 1, days_of_week: [1,2,3,4,5]}
    tags TEXT[],
    motivation TEXT,
    rewards JSONB, -- Array of milestone rewards
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Group Management
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category public.goal_category NOT NULL,
    status public.group_status DEFAULT 'active'::public.group_status,
    visibility public.goal_visibility DEFAULT 'public'::public.goal_visibility,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 50,
    member_count INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT false,
    meeting_schedule JSONB, -- {frequency: 'weekly', day_of_week: 1, time: '19:00', timezone: 'UTC'}
    rules TEXT[],
    tags TEXT[],
    avatar_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Group Memberships
CREATE TABLE public.group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.membership_role DEFAULT 'member'::public.membership_role,
    status public.membership_status DEFAULT 'pending'::public.membership_status,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    contribution_score INTEGER DEFAULT 0,
    
    UNIQUE(group_id, user_id)
);

-- 6. Group Goals (Shared Goals)
CREATE TABLE public.group_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, goal_id)
);

-- 7. Check-ins and Progress Tracking
CREATE TABLE public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    type public.check_in_type DEFAULT 'progress'::public.check_in_type,
    title TEXT NOT NULL,
    content TEXT,
    progress_value DECIMAL,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    challenges_faced TEXT[],
    wins_celebrated TEXT[],
    media_urls TEXT[], -- Photos/videos uploaded with check-in
    is_milestone BOOLEAN DEFAULT false,
    visibility public.goal_visibility DEFAULT 'friends'::public.goal_visibility,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Social Interactions
CREATE TABLE public.check_in_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_in_id UUID REFERENCES public.check_ins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(check_in_id, user_id)
);

CREATE TABLE public.check_in_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_in_id UUID REFERENCES public.check_ins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.check_in_comments(id) ON DELETE CASCADE,
    is_encouragement BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Gamification System
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type public.badge_type NOT NULL,
    icon_url TEXT,
    color TEXT,
    requirements JSONB NOT NULL, -- Conditions to earn badge
    points_value INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    
    UNIQUE(user_id, badge_id)
);

-- 10. Challenges and Competitions
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category public.goal_category NOT NULL,
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    rules JSONB NOT NULL,
    rewards JSONB, -- Prize structure
    participant_count INTEGER DEFAULT 0,
    max_participants INTEGER,
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    current_score DECIMAL DEFAULT 0,
    rank INTEGER,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(challenge_id, user_id)
);

-- 11. Meetings and Events
CREATE TABLE public.meetups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    meeting_url TEXT,
    max_attendees INTEGER,
    attendee_count INTEGER DEFAULT 0,
    is_virtual BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.meetup_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meetup_id UUID REFERENCES public.meetups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(meetup_id, user_id)
);

-- 12. Notifications System
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    related_entity_type TEXT, -- 'goal', 'group', 'user', etc.
    related_entity_id UUID,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Essential Indexes
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_category ON public.goals(category);
CREATE INDEX idx_goals_target_date ON public.goals(target_date);
CREATE INDEX idx_goals_created_at ON public.goals(created_at);

CREATE INDEX idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX idx_groups_category ON public.groups(category);
CREATE INDEX idx_groups_status ON public.groups(status);
CREATE INDEX idx_groups_visibility ON public.groups(visibility);
CREATE INDEX idx_groups_created_at ON public.groups(created_at);

CREATE INDEX idx_group_memberships_group_id ON public.group_memberships(group_id);
CREATE INDEX idx_group_memberships_user_id ON public.group_memberships(user_id);
CREATE INDEX idx_group_memberships_status ON public.group_memberships(status);

CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_goal_id ON public.check_ins(goal_id);
CREATE INDEX idx_check_ins_group_id ON public.check_ins(group_id);
CREATE INDEX idx_check_ins_created_at ON public.check_ins(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- 14. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_in_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_in_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 15. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.group_memberships gm
    WHERE gm.group_id = group_uuid 
    AND gm.user_id = auth.uid()
    AND gm.status = 'active'::public.membership_status
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_goal(goal_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.goals g
    WHERE g.id = goal_uuid
    AND (
        g.user_id = auth.uid() -- Owner can view
        OR g.visibility = 'public' -- Public goals
        OR (g.visibility = 'friends' AND EXISTS (
            -- Friends can view (simplified - in real app would check friendships)
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
        ))
    )
)
$$;

-- 16. RLS Policies

-- User Profiles: Users can manage their own profiles, admins can view all
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "public_can_view_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Goals: Users manage their own, visibility controls apply
CREATE POLICY "users_manage_own_goals"
ON public.goals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_can_view_goals"
ON public.goals
FOR SELECT
TO authenticated
USING (public.can_view_goal(id));

-- Groups: Public groups viewable by all, members can see group details
CREATE POLICY "public_can_view_groups"
ON public.groups
FOR SELECT
TO authenticated
USING (visibility = 'public' OR public.is_group_member(id));

CREATE POLICY "users_manage_own_groups"
ON public.groups
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Group Memberships: Users can join groups, members can see memberships
CREATE POLICY "users_manage_own_memberships"
ON public.group_memberships
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "group_members_view_memberships"
ON public.group_memberships
FOR SELECT
TO authenticated
USING (public.is_group_member(group_id));

-- Group Goals: Group members can view and create
CREATE POLICY "group_members_manage_group_goals"
ON public.group_goals
FOR ALL
TO authenticated
USING (public.is_group_member(group_id))
WITH CHECK (public.is_group_member(group_id) AND created_by = auth.uid());

-- Check-ins: Users manage their own, visibility controls apply
CREATE POLICY "users_manage_own_check_ins"
ON public.check_ins
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_can_view_check_ins"
ON public.check_ins
FOR SELECT
TO authenticated
USING (
    visibility = 'public' 
    OR (visibility = 'friends' AND user_id != auth.uid()) -- Simplified friends check
    OR user_id = auth.uid()
);

-- Check-in Likes: Users can like and unlike
CREATE POLICY "users_manage_check_in_likes"
ON public.check_in_likes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Check-in Comments: Users manage their own comments
CREATE POLICY "users_manage_own_comments"
ON public.check_in_comments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_can_view_comments"
ON public.check_in_comments
FOR SELECT
TO authenticated
USING (true);

-- Badges: Public read, admin manage
CREATE POLICY "public_can_view_badges"
ON public.badges
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_badges"
ON public.badges
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- User Badges: Users can view their own, public can view others
CREATE POLICY "users_view_own_badges"
ON public.user_badges
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR true);

CREATE POLICY "system_creates_user_badges"
ON public.user_badges
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Challenges: Public read for active, creators manage
CREATE POLICY "public_can_view_challenges"
ON public.challenges
FOR SELECT
TO authenticated
USING (is_active = true AND is_public = true);

CREATE POLICY "users_manage_own_challenges"
ON public.challenges
FOR ALL
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- Challenge Participants: Users manage their own participation
CREATE POLICY "users_manage_own_participation"
ON public.challenge_participants
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_can_view_participants"
ON public.challenge_participants
FOR SELECT
TO authenticated
USING (true);

-- Meetups: Group members can view, organizers manage
CREATE POLICY "group_members_view_meetups"
ON public.meetups
FOR SELECT
TO authenticated
USING (public.is_group_member(group_id));

CREATE POLICY "users_manage_own_meetups"
ON public.meetups
FOR ALL
TO authenticated
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

-- Meetup Attendees: Users manage their own attendance
CREATE POLICY "users_manage_own_attendance"
ON public.meetup_attendees
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "group_members_view_attendees"
ON public.meetup_attendees
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.meetups m
        WHERE m.id = meetup_id AND public.is_group_member(m.group_id)
    )
);

-- Notifications: Users manage their own notifications
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 17. Triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, username)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. Update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
    BEFORE UPDATE ON public.check_ins
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 19. Sample Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user1_uuid UUID := gen_random_uuid();
    user2_uuid UUID := gen_random_uuid();
    user3_uuid UUID := gen_random_uuid();
    goal1_uuid UUID := gen_random_uuid();
    goal2_uuid UUID := gen_random_uuid();
    group1_uuid UUID := gen_random_uuid();
    group2_uuid UUID := gen_random_uuid();
    badge1_uuid UUID := gen_random_uuid();
    badge2_uuid UUID := gen_random_uuid();
    challenge1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@communitygoals.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Community Admin", "username": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.johnson@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "username": "sarah_j"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mike.chen@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Chen", "username": "mike_c"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emma.rodriguez@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emma Rodriguez", "username": "emma_r"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- User profiles will be created automatically by trigger, but we can update additional fields
    UPDATE public.user_profiles 
    SET bio = 'Fitness enthusiast and goal-getter!', 
        location = 'New York, NY',
        points = 1250,
        streak_count = 12,
        longest_streak = 28,
        goals_completed = 3,
        groups_joined = 2,
        avatar_url = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    WHERE id = user1_uuid;

    UPDATE public.user_profiles 
    SET bio = 'Personal development focused. Always growing!', 
        location = 'San Francisco, CA',
        points = 890,
        streak_count = 7,
        longest_streak = 15,
        goals_completed = 2,
        groups_joined = 1,
        avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    WHERE id = user2_uuid;

    -- Create sample goals
    INSERT INTO public.goals (id, user_id, title, description, category, status, visibility, target_value, target_unit, start_date, target_date, difficulty_level) VALUES
        (goal1_uuid, user1_uuid, 'Run 5K in Under 25 Minutes', 'Training to achieve a sub-25 minute 5K run time', 'fitness', 'active', 'public', 25, 'minutes', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 3),
        (goal2_uuid, user2_uuid, 'Read 24 Books This Year', 'Challenge to read 2 books per month consistently', 'personal_development', 'active', 'public', 24, 'books', CURRENT_DATE, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day', 2);

    -- Create sample groups
    INSERT INTO public.groups (id, name, description, category, owner_id, max_members, tags) VALUES
        (group1_uuid, 'Fitness Warriors', 'A supportive community for fitness enthusiasts working towards their health and wellness goals.', 'fitness', user1_uuid, 20, ARRAY['fitness', 'running', 'strength', 'accountability']),
        (group2_uuid, 'Book Lovers United', 'Join fellow book enthusiasts as we read, discuss, and grow together through literature.', 'personal_development', user2_uuid, 15, ARRAY['reading', 'books', 'discussion', 'learning']);

    -- Create group memberships
    INSERT INTO public.group_memberships (group_id, user_id, role, status) VALUES
        (group1_uuid, user1_uuid, 'owner', 'active'),
        (group1_uuid, user2_uuid, 'member', 'active'),
        (group2_uuid, user2_uuid, 'owner', 'active'),
        (group2_uuid, user3_uuid, 'member', 'active');

    -- Update group member counts
    UPDATE public.groups SET member_count = 2 WHERE id = group1_uuid;
    UPDATE public.groups SET member_count = 2 WHERE id = group2_uuid;

    -- Create sample check-ins
    INSERT INTO public.check_ins (user_id, goal_id, group_id, type, title, content, progress_value, mood_rating, energy_level, wins_celebrated) VALUES
        (user1_uuid, goal1_uuid, group1_uuid, 'progress', 'Morning 5K Training Run', 'Completed my morning workout routine! 45 minutes of strength training and feeling energized for the day.', 26.5, 5, 5, ARRAY['Maintained pace for 3K', 'New personal best for endurance']),
        (user2_uuid, goal2_uuid, group2_uuid, 'milestone', '30-Day Reading Streak!', 'Just finished Atomic Habits - highly recommend! Celebrating my 30-day reading streak milestone.', 8, 5, 4, ARRAY['Finished 8th book of the year', 'Gained valuable insights on habit formation']);

    -- Create sample badges
    INSERT INTO public.badges (id, name, description, type, requirements, points_value) VALUES
        (badge1_uuid, 'First Steps', 'Complete your first check-in', 'milestone', '{"check_ins": 1}', 10),
        (badge2_uuid, 'Streak Master', 'Maintain a 7-day check-in streak', 'streak', '{"streak_days": 7}', 50);

    -- Award badges to users
    INSERT INTO public.user_badges (user_id, badge_id, goal_id) VALUES
        (user1_uuid, badge1_uuid, goal1_uuid),
        (user1_uuid, badge2_uuid, goal1_uuid),
        (user2_uuid, badge1_uuid, goal2_uuid);

    -- Create a sample challenge
    INSERT INTO public.challenges (id, title, description, category, creator_id, start_date, end_date, rules, rewards, max_participants) VALUES
        (challenge1_uuid, '30-Day Fitness Challenge', 'Complete 30 days of consistent exercise to build healthy habits', 'fitness', admin_uuid, 
         CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 
         '{"daily_exercise_minutes": 30, "rest_days_allowed": 2}', 
         '{"first_place": "Premium membership", "participation": "Digital badge"}', 100);

    -- Create sample notifications
    INSERT INTO public.notifications (user_id, type, title, content, is_read) VALUES
        (user1_uuid, 'reminder', 'Check-in Reminder', 'Do not forget to check in today to maintain your 12-day streak!', false),
        (user2_uuid, 'group', 'New Group Match', 'We found 3 new groups that match your fitness goals. Check them out!', false),
        (user1_uuid, 'achievement', 'Badge Earned!', 'Congratulations! You have earned the Streak Master badge.', false);

END $$;