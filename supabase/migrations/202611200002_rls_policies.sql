-- ProjectHub Phase 1: Row Level Security (RLS) Policies & Auth Bootstrap

-- ============================================================================
-- 1. Enable Row Level Security on All Tables
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Workspace Membership Helper Functions (SECURITY DEFINER avoids recursion)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_workspace_member(target_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces w
    WHERE w.id = target_workspace_id
      AND w.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = target_workspace_id
      AND wm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_write_access(target_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces w
    WHERE w.id = target_workspace_id
      AND w.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = target_workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'member')
  );
$$;

-- ============================================================================
-- 3. Profiles Policies
-- ============================================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 4. Workspaces Policies
-- ============================================================================
CREATE POLICY "Workspace members can view workspaces"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id));

CREATE POLICY "Authenticated users can create personal or owned workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update workspaces"
  ON public.workspaces FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can delete non-personal workspaces"
  ON public.workspaces FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- 5. Workspace Members Policies
-- ============================================================================
CREATE POLICY "Members can view membership in their workspaces"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace owners can manage members"
  ON public.workspace_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. Projects Policies
-- ============================================================================
CREATE POLICY "Workspace members can view projects"
  ON public.projects FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace writers can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    public.has_workspace_write_access(workspace_id)
    AND auth.uid() = owner_id
  );

CREATE POLICY "Workspace writers can update projects"
  ON public.projects FOR UPDATE
  USING (public.has_workspace_write_access(workspace_id))
  WITH CHECK (public.has_workspace_write_access(workspace_id));

CREATE POLICY "Workspace writers can delete projects"
  ON public.projects FOR DELETE
  USING (public.has_workspace_write_access(workspace_id));

-- ============================================================================
-- 7. Tasks Policies
-- ============================================================================
CREATE POLICY "Workspace members can view tasks"
  ON public.tasks FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace writers can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    public.has_workspace_write_access(workspace_id)
    AND auth.uid() = creator_id
  );

CREATE POLICY "Workspace writers can update tasks"
  ON public.tasks FOR UPDATE
  USING (public.has_workspace_write_access(workspace_id))
  WITH CHECK (public.has_workspace_write_access(workspace_id));

CREATE POLICY "Workspace writers can delete tasks"
  ON public.tasks FOR DELETE
  USING (public.has_workspace_write_access(workspace_id));

-- ============================================================================
-- 8. Subtasks Policies
-- ============================================================================
CREATE POLICY "Workspace members can view subtasks"
  ON public.subtasks FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace writers can create subtasks"
  ON public.subtasks FOR INSERT
  WITH CHECK (public.has_workspace_write_access(workspace_id));

CREATE POLICY "Workspace writers can update subtasks"
  ON public.subtasks FOR UPDATE
  USING (public.has_workspace_write_access(workspace_id))
  WITH CHECK (public.has_workspace_write_access(workspace_id));

CREATE POLICY "Workspace writers can delete subtasks"
  ON public.subtasks FOR DELETE
  USING (public.has_workspace_write_access(workspace_id));

-- ============================================================================
-- 9. Automatic Profile & Personal Workspace Bootstrap on Signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
  resolved_name TEXT;
BEGIN
  resolved_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(COALESCE(NEW.email, 'user'), '@', 1)
  );

  INSERT INTO public.profiles (id, email, full_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    resolved_name,
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'user_name'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.workspaces (owner_id, name, slug, description, is_personal)
  VALUES (
    NEW.id,
    'Personal Workspace',
    'personal-' || replace(NEW.id::text, '-', ''),
    'Default personal workspace for projects and tasks',
    TRUE
  )
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner')
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
