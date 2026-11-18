-- Staging first. This migration never changes existing 45+42 production policies.
BEGIN;
CREATE TABLE ya_private.publication_inputs(
 scope text PRIMARY KEY REFERENCES ya_private.workspaces(scope),
 document jsonb NOT NULL, product_ledger jsonb NOT NULL, assessments jsonb NOT NULL,
 evidence_until timestamptz NOT NULL, source_digest text NOT NULL,
 engine_version text NOT NULL, validated_at timestamptz NOT NULL,
 enabled boolean NOT NULL DEFAULT true,next_check_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ya_private.publication_jobs(
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,scope text NOT NULL,
 state text NOT NULL CHECK(state IN('queued','validating','published','unchanged','needs-research','failed')),
 attempts integer NOT NULL DEFAULT 0,created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,
 revision bigint,source_digest text,detail text NOT NULL DEFAULT '');
ALTER TABLE ya_private.publication_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ya_private.publication_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ya_private.publication_inputs,ya_private.publication_jobs FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.ya_scope_evidence_until(p_scope text) RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT least(evidence_until,validated_at+interval '7 days') FROM ya_private.publication_inputs WHERE scope=p_scope AND enabled
$$;
REVOKE ALL ON FUNCTION public.ya_scope_evidence_until(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ya_scope_evidence_until(text) TO anon,authenticated;
DROP POLICY ya_live_read ON public.ya_publications;
CREATE POLICY ya_live_read ON public.ya_publications FOR SELECT TO anon,authenticated USING(
 valid_until>now() AND public.ya_scope_evidence_until(scope)>now() AND EXISTS(SELECT 1 FROM public.ya_publication_heads h WHERE h.scope=ya_publications.scope AND h.revision=ya_publications.revision));
CREATE OR REPLACE FUNCTION public.ya_read_publication(p_scope text) RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$
 SELECT jsonb_build_object('scope',p.scope,'revision',p.revision,'validUntil',least(p.valid_until,public.ya_scope_evidence_until(p.scope)),'document',p.document)
 FROM public.ya_publications p JOIN public.ya_publication_heads h USING(scope,revision) WHERE p.scope=p_scope
$$;
CREATE FUNCTION ya_private.publication_tick() RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE inp ya_private.publication_inputs; head bigint; old_doc jsonb; next_doc jsonb; cards jsonb; until_time timestamptz; job bigint; done integer:=0;
BEGIN
 IF NOT pg_try_advisory_xact_lock(19441101,1) THEN RETURN 0; END IF;
 FOR inp IN SELECT * FROM ya_private.publication_inputs WHERE enabled AND next_check_at<=now() ORDER BY next_check_at LIMIT 5 FOR UPDATE SKIP LOCKED LOOP
  INSERT INTO ya_private.publication_jobs(scope,state,source_digest) VALUES(inp.scope,'queued',inp.source_digest) RETURNING id INTO job;
  BEGIN
   UPDATE ya_private.publication_jobs SET state='validating',attempts=attempts+1 WHERE id=job;
   UPDATE ya_private.publication_inputs SET next_check_at=now()+interval '15 minutes' WHERE scope=inp.scope;
   IF inp.evidence_until<=now() OR inp.validated_at>now() OR inp.validated_at<now()-interval '7 days' THEN
    UPDATE ya_private.publication_jobs SET state='needs-research',finished_at=now(),detail='Evidence expired; no artificial freshness extension' WHERE id=job;
    CONTINUE;
   END IF;
   -- Missing/invalid protected projection never replaces a known publication.
   IF inp.document->>'dataKind'<>'real-research' OR jsonb_typeof(inp.document->'venues')<>'array' OR
      jsonb_array_length(inp.document->'venues')>50 OR inp.source_digest IS NULL THEN RAISE EXCEPTION 'invalid_input'; END IF;
   SELECT h.revision,p.document INTO STRICT head,old_doc FROM public.ya_publication_heads h JOIN public.ya_publications p USING(scope,revision) WHERE h.scope=inp.scope FOR UPDATE OF h;
   IF EXISTS(SELECT 1 FROM jsonb_array_elements(old_doc->'venues') v WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(inp.document->'venues') n WHERE n->>'id'=v->>'id')) THEN
    UPDATE ya_private.publication_jobs SET state='needs-research',finished_at=now(),detail='Manual branch missing or unsafe in new evidence; decision retained for investigation' WHERE id=job;
    CONTINUE;
   END IF;
   -- Keep the currently selected IDs/order, including exclusions, additions and administrator undo.
   SELECT coalesce(jsonb_agg(n ORDER BY o.ordinality),'[]'::jsonb) INTO cards
    FROM jsonb_array_elements(old_doc->'venues') WITH ORDINALITY o(v,ordinality)
    JOIN jsonb_array_elements(inp.document->'venues') n ON n->>'id'=o.v->>'id';
   next_doc=jsonb_set(inp.document,'{venues}',cards);
   until_time=least(now()+interval '24 hours',inp.evidence_until,inp.validated_at+interval '7 days');
   IF next_doc=old_doc AND EXISTS(SELECT 1 FROM public.ya_publications WHERE scope=inp.scope AND revision=head AND valid_until>now()+interval '6 hours') THEN
    UPDATE ya_private.publication_jobs SET state='unchanged',revision=head,finished_at=now(),detail='Unchanged verified input; no duplicate publication' WHERE id=job;
    CONTINUE;
   END IF;
   INSERT INTO public.ya_publications VALUES(inp.scope,head+1,next_doc,until_time);
   UPDATE ya_private.workspaces SET canonical=inp.document,valid_until=until_time WHERE scope=inp.scope;
   INSERT INTO ya_private.decisions(scope,revision,actor,reason,branch_order)
    SELECT inp.scope,head+1,NULL,'Automatic evidence validation and snapshot renewal',coalesce(array_agg(v->>'id' ORDER BY ordinality),ARRAY[]::text[]) FROM jsonb_array_elements(cards) WITH ORDINALITY a(v,ordinality);
   UPDATE public.ya_publication_heads SET revision=head+1 WHERE scope=inp.scope;
   UPDATE ya_private.publication_jobs SET state='published',revision=head+1,finished_at=now(),detail='Original source dates retained; manual selection preserved' WHERE id=job;
   done=done+1;
  EXCEPTION WHEN OTHERS THEN
   UPDATE ya_private.publication_jobs SET state='failed',finished_at=now(),detail='Validation/transaction failed; previous publication retained' WHERE id=job;
   UPDATE ya_private.publication_inputs SET next_check_at=now()+interval '1 hour' WHERE scope=inp.scope;
  END;
 END LOOP;
 RETURN done;
END $$;
REVOKE ALL ON FUNCTION ya_private.publication_tick() FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.ya_publication_job_history() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.ya_is_admin() THEN RAISE EXCEPTION 'unauthorized' USING ERRCODE='42501'; END IF;
 RETURN (SELECT coalesce(jsonb_agg(to_jsonb(j) ORDER BY id DESC),'[]'::jsonb) FROM (SELECT id,scope,state,attempts,created_at,finished_at,revision,detail FROM ya_private.publication_jobs ORDER BY id DESC LIMIT 50) j);
END $$;
REVOKE ALL ON FUNCTION public.ya_publication_job_history() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ya_publication_job_history() TO authenticated;
COMMIT;
