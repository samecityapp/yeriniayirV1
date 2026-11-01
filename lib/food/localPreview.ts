import {headers} from 'next/headers';
/** Explicit local-only preview; never enables production publication. */
export async function isLocalFoodPreview(){
 return process.env.GASTRONOMY_LOCAL_PREVIEW==='1' && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test((await headers()).get('host')||'');
}
