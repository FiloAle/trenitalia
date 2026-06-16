import { searchJourneys } from './search.ts';

async function test() {
  const d = new Date();
  d.setHours(8, 0, 0, 0); 
  let results = await searchJourneys("Milano Centrale", "Roma Termini", d);
  
  if (results.data?.routes) {
    const frecceTypes = new Set<string>();
    for (const r of results.data.routes) {
        for (const l of r.l) {
            frecceTypes.add(l.ts);
        }
    }
    console.log("All train types found:", Array.from(frecceTypes));
  }
}

test().catch(console.error);
