import {readManagementView} from './store';
import type {VenueCardData} from './cards';
import {toVisitorVenue} from './visitorContent';
export interface VenueSelection {schemaVersion:1;dataKind:'real-research';regionId:string;categoryId:string;selectedAt:string|null;revision:number;productionPublished:false;cards:VenueCardData[];warnings:string[]}
export async function readVenueSelection(regionId='moda-kadikoy',categoryId='coffee'):Promise<VenueSelection>{
 const view=await readManagementView(),scope=view.scopes.find(s=>s.key===regionId+'/'+categoryId);
 return {schemaVersion:1,dataKind:'real-research',regionId,categoryId,selectedAt:scope?.lastRunAt||null,revision:view.revision,productionPublished:false,cards:(view.cards||[]).filter(c=>c.regionId===regionId&&c.categoryId===categoryId),warnings:scope?.warnings||['Bölge/kategori araştırılmadı.']};
}

// Visitor presentation only; retains authentication and local-only transport upstream.
export async function readVisitorVenueSelection(regionId='moda-kadikoy',categoryId='coffee'){
 const view=await readVenueSelection(regionId,categoryId);
 return {schemaVersion:1 as const,contentPolicy:'neutral-factual-v1' as const,regionId,categoryId,productionPublished:false as const,cards:view.cards.map(card=>toVisitorVenue(card))};
}
