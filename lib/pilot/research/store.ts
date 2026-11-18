import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { runResearch, deduplicate } from './engine';
import type { ResearchRun } from './types';
const directory = path.join(process.cwd(), 'work', 'pilot-research');
const latest = path.join(directory, 'latest.json');
const COOLDOWN = 10 * 60 * 1000;
export class ResearchBusyError extends Error {}
export async function readLatestResearch(): Promise<ResearchRun | null> {
  try {
    let run = JSON.parse(await fs.readFile(latest, 'utf8'));
    const mapAvailable = (value: ResearchRun) => value.sources.some(source => source.id === 'osm' && source.status === 'ok');
    if (run.schemaVersion !== 1 || !Array.isArray(run.candidates) || !Array.isArray(run.sources)) throw new Error('Invalid research snapshot');
    // A transient map outage must not erase the last usable discovery pool.
    // Keep the failed attempt separate, with its own dates and source failures.
    if (!mapAvailable(run)) {
      const failed = run;
      const histories = (await fs.readdir(directory)).filter(name => /^moda-.*\.json$/.test(name)).sort().reverse();
      for (const name of histories) {
        const historical = JSON.parse(await fs.readFile(path.join(directory, name), 'utf8')) as ResearchRun;
        if (historical.schemaVersion === 1 && Array.isArray(historical.sources) && mapAvailable(historical)) {
          run = { ...historical, lastAttempt: { id: failed.id, completedAt: failed.completedAt, discoveredCount: failed.candidates.length, sources: failed.sources } };
          break;
        }
      }
    }
    // Apply current identity rules to older cached runs without changing retrieval dates or doing network I/O.
    const normalized = deduplicate(run.candidates);
    return { ...run, candidates: normalized.candidates.sort((a,b)=>a.name.localeCompare(b.name,'tr')||a.id.localeCompare(b.id)), duplicatesMerged: run.duplicatesMerged + normalized.merged };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
export async function executeResearch(): Promise<{ run: ResearchRun; reused: boolean }> {
  if (process.env.VERCEL) throw new Error('Research execution is local-only');
  await fs.mkdir(directory, { recursive: true });
  const lockPath = path.join(directory, 'run.lock');
  let lock;
  try { lock = await fs.open(lockPath, 'wx'); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new ResearchBusyError('Araştırma zaten çalışıyor. Tamamlanınca sonuçları yenileyin.');
    throw error;
  }
  try {
    const previous = await readLatestResearch();
    if (previous && Date.now()-Date.parse(previous.lastAttempt?.completedAt || previous.completedAt)<COOLDOWN) return {run:previous,reused:true};
    const run = await runResearch();
    const serialized = JSON.stringify(run, null, 2);
    await fs.writeFile(path.join(directory, `${run.id}.json`), serialized, {flag:'wx'});
    const temporary = path.join(directory, `latest-${process.pid}.tmp`);
    await fs.writeFile(temporary, serialized);
    await fs.rename(temporary, latest);
    // Keep only the 20 most recent historical runs; latest is retained separately.
    const histories = (await fs.readdir(directory)).filter(n=>/^moda-.*\.json$/.test(n)).sort().reverse();
    for (const name of histories.slice(20)) await fs.unlink(path.join(directory,name));
    return {run:(await readLatestResearch()) || run,reused:false};
  } finally { await lock.close(); await fs.unlink(lockPath); }
}
