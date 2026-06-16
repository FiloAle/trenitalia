import { searchJourneys } from './search.ts';

async function test() {
  const d = new Date();
  d.setHours(8, 0, 0, 0); // 08:00
  let results = await searchJourneys("Bologna Centrale", "Roma Termini", d);
  console.log("First fetch:", results.data?.routes?.length, "routes");
  if (!results.data?.routes || results.data.routes.length === 0) return;
  
  let lastRoute = results.data.routes[results.data.routes.length - 1];
  console.log("Last route departure time:", lastRoute.dt, new Date(lastRoute.dx * 1000));
  
  // fetch again from lastRoute.dx + 1 minute
  const nextD = new Date(lastRoute.dx * 1000 + 60000);
  console.log("Fetching next from:", nextD);
  let nextResults = await searchJourneys("Bologna Centrale", "Roma Termini", nextD);
  console.log("Second fetch:", nextResults.data?.routes?.length, "routes");
  if (nextResults.data?.routes && nextResults.data.routes.length > 0) {
      console.log("First of next:", nextResults.data.routes[0].dt);
  }
}

test().catch(console.error);
