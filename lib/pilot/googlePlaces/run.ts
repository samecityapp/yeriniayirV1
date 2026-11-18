import {readVenueSelection} from '../gastronomy/selectionReader';
import {GooglePlacesPilot} from './client';
export async function runSelectedGoogleRatings(execute=false){const selection=await readVenueSelection();return new GooglePlacesPilot().run(selection.cards.map(c=>({id:c.id,name:c.name,address:c.address,coordinates:c.coordinates})),execute);}
