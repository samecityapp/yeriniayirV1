-- PROPOSED ONLY. No existing table, policy, grant or Storage object is changed.
-- Run on an isolated Supabase staging project first; production needs separate approval.
BEGIN;
CREATE SCHEMA ya_private;
REVOKE ALL ON SCHEMA ya_private FROM PUBLIC,anon,authenticated;
CREATE TABLE ya_private.admin_members(user_id uuid PRIMARY KEY REFERENCES auth.users(id),active boolean NOT NULL DEFAULT true);
CREATE TABLE ya_private.workspaces(scope text PRIMARY KEY,canonical jsonb NOT NULL,archive jsonb NOT NULL,archive_sha256 text NOT NULL,
 valid_until timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.ya_publications(scope text NOT NULL,revision bigint NOT NULL,document jsonb NOT NULL,
 valid_until timestamptz NOT NULL,PRIMARY KEY(scope,revision));
CREATE TABLE public.ya_publication_heads(scope text PRIMARY KEY,revision bigint NOT NULL,
 FOREIGN KEY(scope,revision) REFERENCES public.ya_publications(scope,revision));
CREATE TABLE ya_private.decisions(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,scope text NOT NULL,
 revision bigint NOT NULL,actor uuid,reason text NOT NULL,branch_order text[] NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE ya_private.admin_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ya_private.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ya_private.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ya_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ya_publication_heads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ya_publications,public.ya_publication_heads FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.ya_publications,public.ya_publication_heads TO anon,authenticated;
CREATE POLICY ya_head_read ON public.ya_publication_heads FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY ya_live_read ON public.ya_publications FOR SELECT TO anon,authenticated USING(
 valid_until>now() AND EXISTS(SELECT 1 FROM public.ya_publication_heads h WHERE h.scope=ya_publications.scope AND h.revision=ya_publications.revision));

CREATE FUNCTION public.ya_has_membership() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM ya_private.admin_members a WHERE a.user_id=auth.uid() AND a.active)
$$;
CREATE FUNCTION public.ya_is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.ya_has_membership() AND coalesce(auth.jwt()->>'aal','')='aal2'
$$;
REVOKE ALL ON FUNCTION public.ya_has_membership(),public.ya_is_admin() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_has_membership(),public.ya_is_admin() TO authenticated;

CREATE FUNCTION public.ya_read_publication(p_scope text) RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$
 SELECT jsonb_build_object('scope',p.scope,'revision',p.revision,'validUntil',p.valid_until,'document',p.document)
 FROM public.ya_publications p JOIN public.ya_publication_heads h USING(scope,revision) WHERE p.scope=p_scope
$$;
REVOKE ALL ON FUNCTION public.ya_read_publication(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ya_read_publication(text) TO anon,authenticated;

CREATE FUNCTION public.ya_publish_order(p_scope text,p_expected bigint,p_order text[],p_reason text) RETURNS bigint
 LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
 DECLARE w ya_private.workspaces; head bigint; next_revision bigint; body jsonb; cards jsonb;
 BEGIN
  IF NOT public.ya_is_admin() THEN RAISE EXCEPTION 'unauthorized' USING ERRCODE='42501'; END IF;
  SELECT revision INTO head FROM public.ya_publication_heads WHERE scope=p_scope FOR UPDATE;
  -- PT409 is intentional: 40001 would cause PostgREST transaction retries.
  IF head IS NULL OR p_expected IS NULL OR head<>p_expected THEN RAISE EXCEPTION 'revision_conflict' USING ERRCODE='PT409'; END IF;
  SELECT * INTO STRICT w FROM ya_private.workspaces WHERE scope=p_scope;
  IF w.valid_until<=now() THEN RAISE EXCEPTION 'evidence_expired'; END IF;
  IF p_order IS NULL OR p_reason IS NULL OR length(trim(p_reason))<5 OR length(p_reason)>300 OR cardinality(p_order)>50 OR
    (SELECT count(*) FROM unnest(p_order))<>(SELECT count(DISTINCT x) FROM unnest(p_order) x) THEN RAISE EXCEPTION 'invalid_change'; END IF;
  IF EXISTS(SELECT 1 FROM unnest(p_order) x WHERE NOT EXISTS(
    SELECT 1 FROM jsonb_array_elements(w.canonical->'venues') v WHERE v->>'id'=x)) THEN RAISE EXCEPTION 'unverified_branch'; END IF;
  -- Only verified canonical cards can be included; admin text cannot create quality claims.
  SELECT coalesce(jsonb_agg(v ORDER BY o.ordinality),'[]'::jsonb) INTO cards
    FROM unnest(p_order) WITH ORDINALITY o(id,ordinality)
    JOIN jsonb_array_elements(w.canonical->'venues') v ON v->>'id'=o.id;
  body=jsonb_set(w.canonical,'{venues}',cards);next_revision=head+1;
  INSERT INTO public.ya_publications VALUES(p_scope,next_revision,body,w.valid_until);
  INSERT INTO ya_private.decisions(scope,revision,actor,reason,branch_order) VALUES(p_scope,next_revision,auth.uid(),p_reason,p_order);
  UPDATE public.ya_publication_heads SET revision=next_revision WHERE scope=p_scope;
  RETURN next_revision;
 END
$$;
REVOKE ALL ON FUNCTION public.ya_publish_order(text,bigint,text[],text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_publish_order(text,bigint,text[],text) TO authenticated;

CREATE FUNCTION public.ya_admin_history(p_scope text) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
 BEGIN
  IF NOT public.ya_is_admin() THEN RAISE EXCEPTION 'unauthorized' USING ERRCODE='42501'; END IF;
  RETURN (SELECT coalesce(jsonb_agg(to_jsonb(d) ORDER BY d.revision DESC),'[]'::jsonb)
   FROM (SELECT revision,reason,branch_order,created_at FROM ya_private.decisions WHERE scope=p_scope ORDER BY revision DESC LIMIT 50) d);
 END
$$;
REVOKE ALL ON FUNCTION public.ya_admin_history(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_admin_history(text) TO authenticated;
CREATE FUNCTION public.ya_admin_workspace(p_scope text) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
 BEGIN
  IF NOT public.ya_is_admin() THEN RAISE EXCEPTION 'unauthorized' USING ERRCODE='42501'; END IF;
  RETURN (SELECT jsonb_build_object('revision',h.revision,'canonical',w.canonical,
   'order',p.document->'venues','history',public.ya_admin_history(p_scope),'archiveHash',w.archive_sha256,'validUntil',w.valid_until)
   FROM ya_private.workspaces w JOIN public.ya_publication_heads h USING(scope)
   JOIN public.ya_publications p USING(scope,revision) WHERE w.scope=p_scope);
 END
$$;
REVOKE ALL ON FUNCTION public.ya_admin_workspace(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_admin_workspace(text) TO authenticated;
CREATE FUNCTION public.ya_admin_archive(p_scope text) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
 BEGIN
  IF NOT public.ya_is_admin() THEN RAISE EXCEPTION 'unauthorized' USING ERRCODE='42501'; END IF;
  RETURN (SELECT jsonb_build_object('archive',archive,'sha256',archive_sha256) FROM ya_private.workspaces WHERE scope=p_scope);
 END
$$;
REVOKE ALL ON FUNCTION public.ya_admin_archive(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_admin_archive(text) TO authenticated;
-- Explicit owner-only bootstrap/import. No public signup grants administrator access.
-- INSERT INTO ya_private.admin_members(user_id) VALUES ('confirmed-staging-auth-user-uuid');
-- Data import is a separate, checksummed and separately approved operation.
COMMIT;
