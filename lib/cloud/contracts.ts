import {z} from 'zod';
// A deliberately closed visitor contract. No arbitrary JSON, source evidence or Google payloads.
const text=z.string().min(1).max(300);
const venue=z.object({id:text,name:text,location:text,categoryId:text,
 description:z.string().max(200).nullable(),whatToOrder:z.array(text).max(3),menuFrom:z.array(text).max(10),
 alsoTry:z.array(text).max(3),beforeYouGo:z.array(text).max(5),photo:z.null(),ratings:z.array(z.never()).length(0)}).strict();
export const publicationDocument=z.object({schemaVersion:z.literal(1),dataKind:z.literal('real-research'),
 mode:z.literal('integration-preparation'),productionPublished:z.literal(false),
 region:z.object({id:text,slug:text,name:text,displayName:text,path:z.array(text).max(4)}).strict(),
 categories:z.array(z.object({slug:text,id:text,label:text,isMustTry:z.boolean()}).strict()).max(7),
 categorySlug:text,venues:z.array(venue).max(50),rituals:z.array(z.never()).length(0)}).strict().superRefine((d,c)=>{
 if(new Set(d.venues.map(v=>v.id)).size!==d.venues.length)c.addIssue({code:'custom',message:'Duplicate branch'});
 if(d.categories.some((v,i)=>v.isMustTry&&i!==0))c.addIssue({code:'custom',message:'Must-try category must be first'});
});
export const publicationEnvelope=z.object({revision:z.number().int().positive(),scope:text,
 validUntil:z.string().datetime({offset:true}),document:publicationDocument}).strict();
export type PublicationDocument=z.infer<typeof publicationDocument>;
export const publicationChange=z.object({scope:z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
 expectedRevision:z.number().int().positive(),order:z.array(text).max(50),reason:z.string().trim().min(5).max(300)}).strict();
