import { headers } from 'next/headers';
import { checkPilotAdmin } from '@/lib/pilot/adminAuth';
import PilotClient from './PilotClient';
import { readAuditorView } from '@/lib/pilot/auditor/store';
import { readManagementView } from '@/lib/pilot/gastronomy/store';
import { readQualityReport } from '@/lib/pilot/quality/store';
import { readLatestResearch } from '@/lib/pilot/research/store';
import {
  MODA_REFERENCE_ORIGIN, MODA_KADIKOY_GEOGRAPHY,
  MODA_KADIKOY_CATEGORY_ARCHITECTURE, MODA_KADIKOY_COFFEE_CANDIDATES,
} from '@/lib/pilot/modaKadikoyCoffeePilot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ModaKadikoyPilotPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  // Defense in depth: never render dossier data if middleware is bypassed.
  const auth = await checkPilotAdmin((await headers()).get('authorization'));
  if (!auth.ok) throw new Error('Pilot admin access denied');
  const [research, quality, management, auditor] = await Promise.all([readLatestResearch(), readQualityReport(), readManagementView(), readAuditorView()]);
  return <PilotClient
    initialAuditor={auditor}
    initialManagement={management}
    initialResearch={research}
    initialQuality={quality}
    lang={params.lang}
    origin={MODA_REFERENCE_ORIGIN}
    geography={MODA_KADIKOY_GEOGRAPHY}
    categories={MODA_KADIKOY_CATEGORY_ARCHITECTURE}
    initialCandidates={MODA_KADIKOY_COFFEE_CANDIDATES}
  />;
}
