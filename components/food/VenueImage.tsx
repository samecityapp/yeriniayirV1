'use client';
import {useState} from 'react';
import Image from 'next/image';
import {categoryIllustration,illustrationCategory,illustrationLabel} from '@/lib/food/illustrations';

export interface VenueVisual {
 url:string|null;
 kind:'illustration'|'rights-cleared-photo';
 category:string;
 venueId:string;
 /** Only the server rights-verification boundary may supply photo attribution. */
 attribution?:{label:string;url?:string}[];
}

/** An inline last resort also works when the local SVG asset itself is unavailable. */
function InlineCategoryGraphic({category}:{category:string}){
 const c=illustrationCategory(category);
 const drawings={
  coffee:<><path d="M350 230h230v95q0 110-115 110T350 325z" fill="#265bd8"/><path d="M585 250h25q80 0 30 95h-55M410 180q-30-30 0-70m70 70q-30-30 0-70"/></>,
  burger:<><path d="M290 250q20-140 190-140t190 140z" fill="#efe3cb"/><path d="M300 290h360m-350 55h340m-350 45h360"/><path d="M300 405h360q-10 55-80 55H380q-70 0-80-55z" fill="#efe3cb"/></>,
  pizza:<><path d="M320 180q160-90 320 0L480 450z" fill="#f4ead8"/><path d="M320 180q160-90 320 0" strokeWidth="20"/><circle cx="467" cy="240" r="20"/><circle cx="510" cy="319" r="20"/></>,
  breakfast:<><ellipse cx="480" cy="360" rx="240" ry="110" fill="white"/><path d="M310 330q100-180 270-70l75 70-80 50-60-40-60 50-65-40-50 30z" fill="#efe3cb"/><path d="M400 250l35 110m65-125 25 100"/></>,
  dessert:<><path d="M330 260l220-110 90 120-230 120z" fill="#e5edfc"/><path d="M330 260v115l80 45 230-100v-50M410 390v30"/></>,
  regional:<><path d="M290 280h380q-30 160-190 160T290 280z" fill="white"/><path d="M400 200q-30-30 0-80m80 80q-30-30 0-80m80 80q-30-30 0-80m-200 225h240"/></>,
  gastronomy:<><circle cx="480" cy="300" r="150" fill="white"/><path d="M240 160v280m-25-280v80h50v-80m455 0v280m0-280q-60 60 0 140"/></>,
 };
 return <svg viewBox="0 0 960 600" role="img" aria-label={`${illustrationLabel(category)} kategorisi için temsili illüstrasyon`} className="absolute inset-0 h-full w-full bg-[#fffdf8]" preserveAspectRatio="xMidYMid slice"><rect width="960" height="600" fill="#fffdf8"/><circle cx="480" cy="300" r="210" fill="#f0f3fa"/><g fill="none" stroke="#265bd8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">{drawings[c]}</g></svg>;
}

export function VenueImage({visual,priority=false,sizes='(max-width: 640px) 100vw, 672px',className='',labelPlacement='bottom-left'}:{visual:VenueVisual;priority?:boolean;sizes?:string;className?:string;labelPlacement?:'bottom-left'|'below-category'}){
 const [failedUrls,setFailedUrls]=useState<string[]>([]);
 const fallback=categoryIllustration(visual.category,visual.venueId);
 const primary=visual.url||fallback;
 const src=failedUrls.includes(primary)?fallback:primary;
 const inline=failedUrls.includes(src);
 const representative=!visual.url||visual.kind==='illustration'||failedUrls.includes(primary);
 return <>
  {inline?<InlineCategoryGraphic category={visual.category}/>:<Image src={src} alt={representative?`${illustrationLabel(visual.category)} kategorisi için temsili illüstrasyon`:'Doğrulanmış işletme fotoğrafı'} fill sizes={sizes} priority={priority} fetchPriority={priority?'high':undefined} unoptimized={visual.kind==='rights-cleared-photo'} className={`object-cover ${className}`} onError={()=>setFailedUrls(previous=>previous.includes(src)?previous:[...previous,src])}/>}
  {representative?<span data-representative-label className={`absolute ${labelPlacement==='below-category'?'top-14 left-4':'bottom-3 left-3'} z-10 rounded-full border border-slate-200/70 bg-white/95 px-3 py-1 text-[11px] font-semibold leading-normal text-slate-600`}>Temsili görsel</span>:null}
  {!representative&&visual.attribution?.length?<span className="absolute bottom-2 left-2 right-2 z-10 rounded bg-white/95 p-1 text-[10px] text-slate-700">{visual.attribution.map((a,i)=>a.url?<a key={i} href={a.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>{a.label} </a>:<span key={i}>{a.label} </span>)}</span>:null}
 </>;
}
