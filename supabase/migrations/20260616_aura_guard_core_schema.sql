create schema if not exists aura_guard;

create table if not exists aura_guard.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  size_band text,
  region text,
  risk_profile text default 'unknown',
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  email text not null,
  full_name text,
  role text default 'member',
  department text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.ai_tools (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  tool_name text not null,
  vendor_name text,
  use_case text,
  owner_department text,
  data_touched text,
  approved_status text default 'unknown',
  risk_level text default 'unscored',
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.ai_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  agent_name text not null,
  business_function text,
  autonomy_level int default 0 check (autonomy_level >= 0 and autonomy_level <= 5),
  production_status text default 'draft',
  owner_email text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.agent_permissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references aura_guard.ai_agents(id) on delete cascade,
  action_type text not null,
  permission_level text not null check (permission_level in ('allowed','approval_required','prohibited')),
  approval_owner text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  source_name text not null,
  source_type text,
  sensitivity_level int default 0 check (sensitivity_level >= 0 and sensitivity_level <= 5),
  contains_customer_data boolean default false,
  contains_financial_data boolean default false,
  contains_hr_data boolean default false,
  owner_department text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  assessment_name text not null,
  data_sensitivity_score int default 0,
  tool_autonomy_score int default 0,
  external_exposure_score int default 0,
  approval_weakness_score int default 0,
  vendor_risk_score int default 0,
  prompt_injection_score int default 0,
  logging_weakness_score int default 0,
  compliance_gap_score int default 0,
  total_score int generated always as (
    data_sensitivity_score + tool_autonomy_score + external_exposure_score + approval_weakness_score + vendor_risk_score + prompt_injection_score + logging_weakness_score + compliance_gap_score
  ) stored,
  risk_band text generated always as (
    case
      when (data_sensitivity_score + tool_autonomy_score + external_exposure_score + approval_weakness_score + vendor_risk_score + prompt_injection_score + logging_weakness_score + compliance_gap_score) <= 20 then 'Low Risk'
      when (data_sensitivity_score + tool_autonomy_score + external_exposure_score + approval_weakness_score + vendor_risk_score + prompt_injection_score + logging_weakness_score + compliance_gap_score) <= 40 then 'Moderate Risk'
      when (data_sensitivity_score + tool_autonomy_score + external_exposure_score + approval_weakness_score + vendor_risk_score + prompt_injection_score + logging_weakness_score + compliance_gap_score) <= 60 then 'Elevated Risk'
      when (data_sensitivity_score + tool_autonomy_score + external_exposure_score + approval_weakness_score + vendor_risk_score + prompt_injection_score + logging_weakness_score + compliance_gap_score) <= 80 then 'High Risk'
      else 'Critical Risk'
    end
  ) stored,
  executive_summary text,
  remediation_plan text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.prompt_tests (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references aura_guard.ai_agents(id) on delete cascade,
  test_name text not null,
  test_category text,
  result text default 'not_run',
  severity text default 'unknown',
  mitigation text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.vendor_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  vendor_name text not null,
  tool_name text,
  privacy_score int default 0,
  security_score int default 0,
  admin_control_score int default 0,
  data_training_risk text,
  recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  policy_type text not null,
  title text not null,
  content text not null,
  version text default 'v1',
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  agent_id uuid references aura_guard.ai_agents(id) on delete set null,
  event_type text not null,
  severity text default 'info',
  actor text,
  summary text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  risk_assessment_id uuid references aura_guard.risk_assessments(id) on delete set null,
  report_type text not null,
  title text not null,
  status text default 'draft',
  file_url text,
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references aura_guard.organizations(id) on delete cascade,
  plan_name text not null,
  price_usd numeric(10,2),
  billing_status text default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists aura_guard.client_workspaces (
  id uuid primary key default gen_random_uuid(),
  partner_organization_id uuid references aura_guard.organizations(id) on delete cascade,
  client_organization_id uuid references aura_guard.organizations(id) on delete cascade,
  branding_name text,
  branding_logo_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_aura_guard_ai_tools_org on aura_guard.ai_tools(organization_id);
create index if not exists idx_aura_guard_ai_agents_org on aura_guard.ai_agents(organization_id);
create index if not exists idx_aura_guard_risk_assessments_org on aura_guard.risk_assessments(organization_id);
create index if not exists idx_aura_guard_reports_org on aura_guard.reports(organization_id);
