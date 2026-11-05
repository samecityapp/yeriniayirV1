-- Staging repair only; existing tables, decisions, archives and policies preserved.
BEGIN;
CREATE OR REPLACE FUNCTION public.ya_publish_order(p_scope text,p_expected bigint,p_order text[],p_reason text) RETURNS bigint
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
COMMIT;
