-- ============================================================================
-- YERİNİ AYIR — GASTRONOMİ KEŞİF MOTORU V2 CANONICAL SCHEMA (STAGING)
-- Separates Discovery Pool, Branch Identity, Multi-Channel Evidence,
-- Guest Satisfaction Signals, Chain/Hotel Policy, Quarantine, and Publication.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gastronomy_regions (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  display_name text NOT NULL,
  level text NOT NULL CHECK (level IN ('il', 'ilce', 'semt')),
  path text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('published', 'staging', 'coming_soon', 'quarantined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gastronomy_categories (
  id text PRIMARY KEY,
  region_id text NOT NULL REFERENCES public.gastronomy_regions(id) ON DELETE CASCADE,
  slug text NOT NULL,
  label text NOT NULL,
  user_intent_summary text NOT NULL,
  is_must_try boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  UNIQUE (region_id, slug)
);

CREATE TABLE IF NOT EXISTS public.gastronomy_venues (
  id text PRIMARY KEY,
  region_id text NOT NULL REFERENCES public.gastronomy_regions(id) ON DELETE CASCADE,
  parent_brand text,
  branch_name text NOT NULL,
  official_address text,
  sub_zone text,
  coordinates jsonb,
  official_website_url text,
  google_place_id text,
  google_cid text,
  google_rating_status text NOT NULL DEFAULT 'NEEDS_RESEARCH'
    CHECK (google_rating_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  operation_status text NOT NULL DEFAULT 'NEEDS_RESEARCH'
    CHECK (operation_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  identity_status text NOT NULL DEFAULT 'NEEDS_RESEARCH'
    CHECK (identity_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  branch_status text NOT NULL DEFAULT 'NEEDS_RESEARCH'
    CHECK (branch_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  is_franchise_chain boolean NOT NULL DEFAULT false,
  is_hotel_venue boolean NOT NULL DEFAULT false,
  chain_or_hotel_exception_reason text,
  publication_state text NOT NULL DEFAULT 'candidate'
    CHECK (publication_state IN ('published', 'candidate', 'quarantined', 'rejected', 'manual_held')),
  quarantine_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gastronomy_sources (
  id text PRIMARY KEY,
  venue_id text NOT NULL REFERENCES public.gastronomy_venues(id) ON DELETE CASCADE,
  category_id text REFERENCES public.gastronomy_categories(id) ON DELETE SET NULL,
  channel text NOT NULL CHECK (channel IN (
    'local_publications',
    'critic_guides_awards',
    'recent_guest_satisfaction',
    'category_specialists',
    'emerging_local_gems',
    'experience_intent',
    'official_operator'
  )),
  source_family text NOT NULL,
  source_url text NOT NULL,
  published_at date,
  experience_at date,
  checked_at timestamptz NOT NULL DEFAULT now(),
  claim_scope text NOT NULL DEFAULT 'branch' CHECK (claim_scope IN ('branch', 'brand')),
  is_independent boolean NOT NULL DEFAULT true,
  is_sponsored_or_seo_listicle boolean NOT NULL DEFAULT false,
  extracted_products text[] NOT NULL DEFAULT '{}',
  positive_signals text[] NOT NULL DEFAULT '{}',
  negative_signals text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.gastronomy_venue_decisions (
  venue_id text NOT NULL REFERENCES public.gastronomy_venues(id) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES public.gastronomy_categories(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('SELECTED', 'RESERVE', 'QUARANTINED', 'NEEDS_RESEARCH', 'REJECTED')),
  display_rank integer,
  category_fit_status text NOT NULL CHECK (category_fit_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  gastronomic_evidence_status text NOT NULL CHECK (gastronomic_evidence_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  product_verification_status text NOT NULL CHECK (product_verification_status IN ('VERIFIED', 'NEEDS_RESEARCH', 'CONFLICTED', 'REJECTED')),
  why_selected text NOT NULL,
  beaten_alternatives text[] NOT NULL DEFAULT '{}',
  verified_claims text[] NOT NULL DEFAULT '{}',
  significant_complaints text[] NOT NULL DEFAULT '{}',
  potential_missed_candidates text[] NOT NULL DEFAULT '{}',
  visitor_description text,
  visitor_what_to_order text[] NOT NULL DEFAULT '{}',
  visitor_menu_from text[] NOT NULL DEFAULT '{}',
  visitor_also_try text[] NOT NULL DEFAULT '{}',
  visitor_before_you_go text[] NOT NULL DEFAULT '{}',
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (venue_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.gastronomy_benchmarks (
  id text PRIMARY KEY,
  region_id text NOT NULL REFERENCES public.gastronomy_regions(id) ON DELETE CASCADE,
  expected_venue_name text NOT NULL,
  expected_branch_sub_zone text NOT NULL,
  expected_address text NOT NULL,
  official_url text,
  target_categories text[] NOT NULL DEFAULT '{}',
  rationale text NOT NULL
);
